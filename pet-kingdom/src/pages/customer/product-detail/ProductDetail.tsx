import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { Heart, CheckCircle, XCircle } from "lucide-react";

import { Product } from "../../../types/admin";
import { productApi } from "../../../services/admin-api/productApi";
import { cartApi } from "../../../services/customer-api/api";
import { wishlistApi } from "../../../services/customer-api/wishlistApi";
import { useToast } from "../../../contexts/ToastContext";

import RelatedList from "../../../components/products/related-products/RelatedList";
import BackButton from "../../../components/common/back-button/BackButton";
import "./ProductDetail.css";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [inCartQty, setInCartQty] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const { showToast } = useToast();

  // Load giỏ hàng khi component mount
  const fetchCart = useCallback(async () => {
    if (!id) return;
    const stored = localStorage.getItem("user");
    if (!stored) return;
    const user = JSON.parse(stored);
    try {
      const res = await cartApi.getCart(user._id);
      if (res.data.success) {
        const cartItems = res.data.data.items;
        const productInCart = cartItems.find(
          (item: any) => item.product._id === id || item.product.id === id
        );
        setInCartQty(productInCart ? productInCart.quantity : 0);
      }
    } catch (err) {
      console.error("Error loading cart:", err);
    }
  }, [id]);

  // Kiểm tra nếu sản phẩm đã có trong danh sách yêu thích
  const checkWishlistStatus = useCallback(async () => {
    if (!id) return;
    const stored = localStorage.getItem("user");
    if (!stored) return;

    try {
      const user = JSON.parse(stored);
      const result = await wishlistApi.checkWishlistItem(user._id, id);
      setIsInWishlist(result.data.isInWishlist);
    } catch (err) {
      console.error("Error checking wishlist status", err);
    }
  }, [id]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    checkWishlistStatus();
  }, [checkWishlistStatus]);

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        const res = await productApi.getProductById(id);
        setProduct(res.data);
      } catch (err) {
        console.error("Failed to fetch product:", err);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product || !id) return;

    const token = localStorage.getItem("token");
    const stored = localStorage.getItem("user");

    if (!token || !stored) {
      showToast(
        "Bạn chưa đăng nhập, xin vui lòng đăng nhập trước khi thêm giỏ hàng",
        "warning"
      );
      return;
    }

    const user = JSON.parse(stored);
    if (user.role !== "Customer") {
      showToast("Chỉ Customer mới được thêm vào giỏ hàng", "warning");
      return;
    }

    // Nếu là pet và đã có trong giỏ hàng thì không cho thêm nữa
    if (product.type === "pet" && inCartQty > 0) {
      showToast("Bạn đã thêm thú cưng này vào giỏ hàng rồi", "info");
      return;
    }

    // Kiểm tra stock
    if (product.stock <= 0) {
      showToast("Sản phẩm đã hết hàng", "error");
      return;
    }

    // Kiểm tra nếu sản phẩm không phải pet đã đạt tối đa số lượng trong kho
    if (product.type !== "pet" && inCartQty >= product.stock) {
      return;
    }

    try {
      // Đối với sản phẩm không phải pet, nếu đã có trong giỏ hàng thì tăng số lượng
      if (product.type !== "pet" && inCartQty > 0) {
        await cartApi.updateQuantity(user._id, id, inCartQty + 1);
        showToast("Đã tăng số lượng trong giỏ hàng", "success");
      } else {
        // Đối với sản phẩm mới, thêm vào giỏ hàng
        await cartApi.addItem(user._id, id, 1);
        showToast("Đã thêm vào giỏ hàng", "success");
      }
      setInCartQty((prev) => prev + 1);
    } catch (err: any) {
      showToast(
        err.response?.data?.message || "Thêm vào giỏ hàng thất bại",
        "error"
      );
    }
  };

  const handleGoToCart = () => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      showToast(
        "Chỉ khách hàng đã đăng nhập mới có thể truy cập giỏ hàng",
        "warning"
      );
      return;
    }

    const user = JSON.parse(stored);
    if (user.role !== "Customer") {
      showToast("Chỉ Customer mới được truy cập giỏ hàng", "warning");
      return;
    }

    navigate("/cart");
  };

  const handleToggleWishlist = async () => {
    if (!id) return;

    const token = localStorage.getItem("token");
    const stored = localStorage.getItem("user");

    if (!token || !stored) {
      showToast(
        "Bạn chưa đăng nhập, xin vui lòng đăng nhập trước khi thêm vào danh sách yêu thích",
        "warning"
      );
      return;
    }

    const user = JSON.parse(stored);
    if (user.role !== "Customer") {
      showToast(
        "Chỉ Customer mới được thêm vào danh sách yêu thích",
        "warning"
      );
      return;
    }

    setIsWishlistLoading(true);

    try {
      if (!isInWishlist) {
        await wishlistApi.addToWishlist(user._id, id);
        showToast("Đã thêm vào danh sách yêu thích", "success");
      } else {
        await wishlistApi.removeFromWishlist(user._id, id);
        showToast("Đã xóa khỏi danh sách yêu thích", "success");
      }
      setIsInWishlist(!isInWishlist);
    } catch (err: any) {
      showToast(
        err.response?.data?.message ||
          "Thao tác với danh sách yêu thích thất bại",
        "error"
      );
    } finally {
      setIsWishlistLoading(false);
    }
  };

  if (!product) {
    return (
      <div className="product-detail-loading-message">
        Không thể tải sản phẩm...
      </div>
    );
  }

  return (
    <div className="product-detail-page" style={{ position: "relative" }}>
      <BackButton
        style={{ top: "40px", left: "18%" }}
        fallbackPath="/products"
      />
      <div className="product-detail-container">
        <div className="image-container">
          <img
            className="product-image"
            src={product.imageUrl}
            alt={product.name}
          />
        </div>
        <div className="info-container">
          <p className="product-title">{product.name}</p>
          <div className="first-info">
            <p>{product.price.toLocaleString()}₫</p>
            <p style={{ marginLeft: "50px" }}>Số lượng: {product.stock}</p>
          </div>

          {product.type === "pet" && (
            <div className="second-info">
              <p>
                Ngày sinh:{" "}
                {product.birthday &&
                  new Date(product.birthday).toLocaleDateString("vi-VN")}
              </p>
              <p>Giới tính: {product.gender === "male" ? "Đực" : "Cái"}</p>
              <p>
                <span
                  className={`vaccination-badge ${
                    product.vaccinated ? "vaccinated" : "not-vaccinated"
                  }`}
                >
                  {product.vaccinated ? (
                    <>
                      <CheckCircle size={16} strokeWidth={3} />
                      Đã tiêm chủng
                    </>
                  ) : (
                    <>
                      <XCircle size={16} strokeWidth={3} />
                      Chưa tiêm chủng
                    </>
                  )}
                </span>
              </p>
            </div>
          )}

          {product.type === "tool" && product.brand && (
            <div className="second-info">
              <p>Thương hiệu: {product.brand}</p>
            </div>
          )}

          <div className="main-description">
            <p>Mô tả: </p>
            <p>{product.description}</p>
          </div>
          <div className="button-list">
            <button
              className={`pdetail-add-to-cart ${
                product.stock <= 0
                  ? "out-of-stock"
                  : product.type === "pet" && inCartQty > 0
                  ? "pet-disabled"
                  : product.type !== "pet" && inCartQty >= product.stock
                  ? "tool-disabled"
                  : inCartQty > 0
                  ? "in-cart"
                  : ""
              }`}
              onClick={handleAddToCart}
              disabled={
                product.stock <= 0 ||
                (product.type === "pet" && inCartQty > 0) ||
                (product.type !== "pet" && inCartQty >= product.stock)
              }
            >
              {product.stock <= 0
                ? "Hết hàng"
                : product.type === "pet" && inCartQty > 0
                ? "Đã thêm vào giỏ hàng"
                : product.type !== "pet" && inCartQty >= product.stock
                ? "Đã đạt số lượng tối đa"
                : inCartQty > 0
                ? "Đã thêm vào giỏ hàng"
                : "Thêm vào giỏ hàng"}
            </button>
            <button className="pdetail-go-to-cart" onClick={handleGoToCart}>
              Đi đến giỏ hàng
            </button>
            <button
              className={`pdetail-wishlist-btn ${
                isInWishlist ? "in-wishlist" : ""
              }`}
              onClick={handleToggleWishlist}
              disabled={isWishlistLoading}
            >
              {isInWishlist ? (
                <>
                  <Heart
                    fill="#e74c3c"
                    stroke="#e74c3c"
                    style={{ marginRight: "8px" }}
                    size={16}
                  />
                  Đã thêm vào yêu thích
                </>
              ) : (
                <>
                  <Heart style={{ marginRight: "8px" }} size={16} />
                  Thêm vào yêu thích
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      <RelatedList />
    </div>
  );
}
