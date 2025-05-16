import "./RelatedList.css";
import ProductCard from "../ProductCard";
import { useEffect, useState, useCallback } from "react";
import { productApi } from "../../../services/admin-api/productApi";
import { cartApi } from "../../../services/customer-api/api";
import { Product } from "../../../types/admin";
import { useParams } from "react-router-dom";
import { useToast } from "../../../contexts/ToastContext";

export default function RelatedList() {
  const { id } = useParams(); // Lấy productId từ URL
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [cartQtyById, setCartQtyById] = useState<Record<string, number>>({});
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

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

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
          />
        ))}
      </div>
    </div>
  );
}
