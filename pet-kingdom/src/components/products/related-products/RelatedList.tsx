import "./RelatedList.css";
import ProductCard from "../ProductCard";
import { useEffect, useState, useCallback } from "react";
import { productApi } from "../../../services/admin-api/productApi";
import { cartApi } from "../../../services/customer-api/api";
import { wishlistApi } from "../../../services/customer-api/wishlistApi";
import { Product } from "../../../types/product";
import { useParams } from "react-router-dom";
import { useToast } from "../../../contexts/ToastContext";

export default function RelatedList() {
  const { id } = useParams(); // Lấy productId từ URL
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [cartQtyById, setCartQtyById] = useState<Record<string, number>>({});
  const [wishlistItemIds, setWishlistItemIds] = useState<Set<string>>(
    new Set()
  );
  const [wishlistLoadingIds, setWishlistLoadingIds] = useState<Set<string>>(
    new Set()
  );
  const { showToast } = useToast();

  // Load giỏ hàng khi component mount
  const fetchCart = useCallback(async () => {
    const stored = localStorage.getItem("user");
    if (!stored) return;
    const user = JSON.parse(stored);
    try {
      const res = await cartApi.getCart(user._id);
      if (res.data.success) {
        const map: Record<string, number> = {};
        res.data.data.items.forEach((item: any) => {
          map[item.product._id] = item.quantity;
        });
        setCartQtyById(map);
      }
    } catch (err) {
      console.error("Error loading cart:", err);
    }
  }, []);

  // Fetch user wishlist items
  const fetchWishlistItems = useCallback(async () => {
    const stored = localStorage.getItem("user");
    if (!stored) return;

    const user = JSON.parse(stored);
    if (user.role !== "Customer") return;

    try {
      const response = await wishlistApi.getWishlist(user._id);
      if (response.success && response.data.products) {
        const wishlistIds = new Set(
          response.data.products.map(
            (product: any) => product._id || product.id
          )
        );
        setWishlistItemIds(wishlistIds);
      }
    } catch (err) {
      console.error("Error fetching wishlist items:", err);
    }
  }, []);

  useEffect(() => {
    fetchCart();
    fetchWishlistItems();
  }, [fetchCart, fetchWishlistItems]);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        if (!id) return;
        const res = await productApi.getRelatedProducts(id);
        if (res.success) {
          const productsWithMappedIds = res.data.map((product: any) => ({
            ...product,
            id: product._id,
          }));
          setRelatedProducts(productsWithMappedIds);
        }
      } catch (error) {
        console.error("Error fetching related products:", error);
      }
    };

    fetchRelatedProducts();
  }, [id]);

  // Xử lý thêm vào giỏ hàng, tương tự ProductList
  const handleAdd = async (productId: string) => {
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

    try {
      await cartApi.addItem(user._id, productId, 1);
      setCartQtyById((prev) => ({
        ...prev,
        [productId]: (prev[productId] || 0) + 1,
      }));
      showToast("Đã thêm vào giỏ hàng", "success");
    } catch (err: any) {
      showToast(
        err.response?.data?.message || "Thêm vào giỏ hàng thất bại",
        "error"
      );
    }
  };

  // Xử lý khi click nút Wishlist
  const handleToggleWishlist = async (productId: string) => {
    const token = localStorage.getItem("token");
    const stored = localStorage.getItem("user");

    if (!token || !stored) {
      showToast(
        "Vui lòng đăng nhập để thêm sản phẩm vào danh sách yêu thích",
        "warning"
      );
      return;
    }

    const user = JSON.parse(stored);
    if (user.role !== "Customer") {
      showToast("Chỉ Customer mới được sử dụng tính năng này", "warning");
      return;
    }

    setWishlistLoadingIds((prev) => new Set(prev).add(productId));
    const isInWishlist = wishlistItemIds.has(productId);

    try {
      if (!isInWishlist) {
        await wishlistApi.addToWishlist(user._id, productId);
        setWishlistItemIds((prev) => new Set([...prev, productId]));
        showToast("Đã thêm vào danh sách yêu thích", "success");
      } else {
        await wishlistApi.removeFromWishlist(user._id, productId);
        setWishlistItemIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
        showToast("Đã xóa khỏi danh sách yêu thích", "success");
      }
    } catch (err) {
      console.error("Error updating wishlist", err);
      showToast("Không thể cập nhật danh sách yêu thích", "error");
    } finally {
      setWishlistLoadingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  return (
    <div className="related-container">
      <p className="title">Sản phẩm liên quan</p>
      <div className="related-list">
        {relatedProducts.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            image={product.imageUrl}
            title={product.name}
            price={product.price}
            stock={
              product.type === "pet"
                ? product.stock > 0
                  ? 1
                  : 0
                : product.stock
            }
            type={product.type as "pet" | "tool"}
            inCartQty={cartQtyById[product.id] || 0}
            onAdd={() => {
              if (
                product.type === "pet" &&
                (cartQtyById[product.id] || 0) > 0
              ) {
                showToast("Bạn đã thêm thú cưng này vào giỏ hàng rồi", "info");
              } else {
                handleAdd(product.id);
              }
            }}
            isInWishlist={wishlistItemIds.has(product.id)}
            onToggleWishlist={handleToggleWishlist}
            isWishlistLoading={wishlistLoadingIds.has(product.id)}
          />
        ))}
      </div>
    </div>
  );
}
