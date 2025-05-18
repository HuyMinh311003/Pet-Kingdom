import { useState, useEffect, useCallback } from "react";
import { wishlistApi } from "../../services/customer-api/wishlistApi";
import { Product } from "../../types/admin";
import { useToast } from "../../contexts/ToastContext";
import ProductCard from "../products/ProductCard";
import { Trash2 } from "lucide-react";
import "./Wishlist.css";
import { cartApi } from "../../services/customer-api/api";

export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const { showToast } = useToast();
  const [cartQtyById, setCartQtyById] = useState<Record<string, number>>({});
  const [wishlistLoadingIds, setWishlistLoadingIds] = useState<Set<string>>(
    new Set()
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user._id) {
      setUserId(user._id);
    }
  }, []);

  // Fetch cart data to check which products are already in cart
  const fetchCart = useCallback(async () => {
    if (!userId) return;

    try {
      const res = await cartApi.getCart(userId);
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
  }, [userId]);

  const fetchWishlist = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const response = await wishlistApi.getWishlist(userId);
      if (response.success) {
        // Ensure each product has an id property mapped from _id if needed
        const processedProducts = response.data.products.map(
          (product: any) => ({
            ...product,
            id: product.id || product._id,
          })
        );
        setWishlistItems(processedProducts);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      showToast("Không thể tải danh sách yêu thích", "error");
    } finally {
      setLoading(false);
    }
  }, [userId, showToast]);

  useEffect(() => {
    if (userId) {
      fetchWishlist();
      fetchCart();
    }
  }, [userId, fetchWishlist, fetchCart]);

  const handleClearWishlist = async () => {
    if (!userId || wishlistItems.length === 0) return;

    try {
      await wishlistApi.clearWishlist(userId);
      setWishlistItems([]);
      showToast("Đã xóa tất cả sản phẩm khỏi danh sách yêu thích", "success");
    } catch (error) {
      console.error("Error clearing wishlist:", error);
      showToast("Không thể xóa danh sách yêu thích", "error");
    }
  };

  const handleToggleWishlist = async (productId: string) => {
    if (!userId) {
      showToast("Vui lòng đăng nhập để sử dụng tính năng này", "warning");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.role !== "Customer") {
      showToast("Chỉ khách hàng mới được sử dụng tính năng này", "warning");
      return;
    }

    // Set loading state for this product
    setWishlistLoadingIds((prev) => new Set(prev).add(productId));

    try {
      // Since we're in the wishlist already, we know we're removing
      await wishlistApi.removeFromWishlist(userId, productId);

      // Update local state by removing the product
      setWishlistItems((prevItems) =>
        prevItems.filter((item) => (item.id || (item as any)._id) !== productId)
      );

      showToast("Đã xóa khỏi danh sách yêu thích", "success");
    } catch (err) {
      console.error("Error removing from wishlist", err);
      showToast("Không thể xóa khỏi danh sách yêu thích", "error");
    } finally {
      setWishlistLoadingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  // Add to cart handler
  const handleAddToCart = async (productId: string, type: string) => {
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

    // Check if this is a pet that's already in cart
    if (type === "pet" && (cartQtyById[productId] || 0) > 0) {
      showToast("Bạn đã thêm thú cưng này vào giỏ hàng rồi", "info");
      return;
    }

    try {
      await cartApi.addItem(userId, productId, 1);
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

  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = wishlistItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(wishlistItems.length / itemsPerPage);

  if (loading) {
    return (
      <div className="loading-indicator">Đang tải danh sách yêu thích...</div>
    );
  }

  return (
    <div className="wishlist-container">
      <div className="wishlist-header">
        <h2>Danh sách yêu thích</h2>
        {wishlistItems.length > 0 && (
          <button className="clear-wishlist-btn" onClick={handleClearWishlist}>
            <Trash2 size={16} />
            <span>Xóa tất cả</span>
          </button>
        )}
      </div>

      {wishlistItems.length === 0 ? (
        <div className="empty-wishlist">
          <p>Bạn chưa có sản phẩm nào trong danh sách yêu thích.</p>
          <a href="/products" className="browse-products-btn">
            Tiếp tục mua sắm
          </a>
        </div>
      ) : (
        <>
          <div className="wishlist-grid">
            {currentItems.map((item) => (
              <ProductCard
                key={item.id || (item as any)._id}
                id={item.id || (item as any)._id}
                image={item.imageUrl}
                title={item.name}
                price={item.price}
                stock={item.stock}
                type={item.type as "pet" | "tool"}
                inCartQty={cartQtyById[item.id || (item as any)._id] || 0}
                onAdd={() => {
                  const productId = item.id || (item as any)._id;
                  if (productId) {
                    handleAddToCart(productId, item.type as string);
                  }
                }}
                isInWishlist={true}
                onToggleWishlist={handleToggleWishlist}
                isWishlistLoading={wishlistLoadingIds.has(
                  item.id || (item as any)._id
                )}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="wishlist-pagination">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              {"<<"}
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              {"<"}
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => {
                if (totalPages <= 5) return true;
                if (currentPage <= 3) return page <= 5;
                if (currentPage >= totalPages - 2)
                  return page >= totalPages - 4;
                return Math.abs(page - currentPage) <= 2;
              })
              .map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={currentPage === page ? "active" : ""}
                >
                  {page}
                </button>
              ))}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages || totalPages === 0}
            >
              {">"}
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              {">>"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
