import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronDown, Filter } from "lucide-react";
import "./ProductStyle.css";
import ProductCard from "./ProductCard";
import { api } from "../../services/customer-api/api";
import { useSearchParams } from "react-router-dom";
import PriceRangeSlider from "./filters/PriceRangeSlider";
import SidebarFilter from "./SidebarFilter";
import { cartApi } from "../../services/customer-api/api";
import { wishlistApi } from "../../services/customer-api/wishlistApi";
import { useToast } from "../../contexts/ToastContext";
import {
  KeyboardDoubleArrowLeft,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  KeyboardDoubleArrowRight,
} from "@mui/icons-material";
import { Category } from "../../types/category";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  type: "pet" | "tool";
  birthday?: string;
  gender?: "male" | "female";
  vaccinated?: boolean;
  brand?: string;
  stock: number;
}

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || ""; // categoryParam có thể là "id1,id2" nếu multi-select
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categoryParam ? categoryParam.split(",") : []
  );
  const isInitialLoad = useRef(true);

  const [cartItemIds, setCartItemIds] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<"pet" | "tool">("pet");

  const [overallMaxPrice, setOverallMaxPrice] = useState(0);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000000 });
  const [expandedSections, setExpandedSections] = useState({
    priceRange: false,
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const [cartQtyById, setCartQtyById] = useState<Record<string, number>>({});
  const [wishlistItemIds, setWishlistItemIds] = useState<Set<string>>(
    new Set()
  );
  const [wishlistLoadingIds, setWishlistLoadingIds] = useState<Set<string>>(
    new Set()
  );

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const itemsPerPage = 9;

  // helper: lấy tất cả leaf IDs
  const getDescendantLeafIds = (cat: Category): string[] => {
    if (!cat.children || !cat.children.length) {
      return [cat._id];
    }
    return cat.children.flatMap((c) => getDescendantLeafIds(c));
  };

  const { showToast } = useToast();

  // xử lý khi click ADD TO CART
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
      showToast("Chỉ Customer mới được sử dụng chức năng này", "warning");
      return;
    }

    try {
      await cartApi.addItem(user._id, productId, 1);
      setCartQtyById((prev) => ({
        ...prev,
        [productId]: (prev[productId] || 0) + 1,
      }));
      setCartItemIds((prev) => [...prev, productId]);
      showToast("Đã thêm vào giỏ hàng", "success");
    } catch (err: any) {
      showToast(
        err.response?.data?.message || "Thêm vào giỏ hàng thất bại",
        "error"
      );
    }
  };

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

  // Handle toggle wishlist item
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
    fetchWishlistItems();
  }, [fetchCart, fetchWishlistItems]);

  useEffect(() => {
    let mounted = true;
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [catRes, prodRes] = await Promise.all([
          api.get("/categories"),
          api.get("/products"),
        ]);

        if (!mounted) return;

        // 1) set categories tree
        const tree = catRes.data.data as Category[];
        setCategories(tree);
        // 2) set all products + tính maxPrice, priceRange
        const all = prodRes.data.data.products as Product[];
        setProducts(all);
        const maxPrice = all.reduce((mx, p) => Math.max(mx, p.price), 0);
        setOverallMaxPrice(maxPrice);
        setPriceRange({ min: 0, max: maxPrice });
      } catch (err) {
        console.error("Error fetching initial data:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchInitialData();
    return () => {
      mounted = false;
    };
  }, []);

  // 2) Khi categories load xong, nếu có initialCategoryId thì set activeTab và selectedCategories
  useEffect(() => {
    if (!categories.length || !categoryParam || !isInitialLoad.current) return;
    // tìm node bất kỳ trong cây
    const findNode = (nodes: Category[]): Category | null => {
      for (const n of nodes) {
        if (n._id === categoryParam) return n;
        if (n.children) {
          const hit = findNode(n.children);
          if (hit) return hit;
        }
      }
      return null;
    };

    const cat = findNode(categories);
    if (cat) {
      setActiveTab(cat.type);
      const urlIds = categoryParam.split(",");
      const isOnlyParent = urlIds.length === 1 && cat._id === urlIds[0] && cat.children?.length;
      const toSelect = isOnlyParent ? getDescendantLeafIds(cat) : urlIds;

      setSelectedCategories(toSelect);
      isInitialLoad.current = false;
    }
  }, [categories, categoryParam]);

  useEffect(() => {
    const fetchFiltered = async () => {
      setLoading(true);
      try {
        const params: any = {
          page: currentPage,
          limit: itemsPerPage,
        };
        if (selectedCategories.length)
          params.category = selectedCategories.join(",");
        if (priceRange.min > 0) params.minPrice = priceRange.min;
        if (priceRange.max < overallMaxPrice) params.maxPrice = priceRange.max;

        const res = await api.get("/products", { params });
        if (res.data.success) {
          setProducts(res.data.data.products);
          setTotalPages(res.data.data.pagination.pages);
        }
      } catch (err) {
        console.error("Error fetching filtered products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFiltered();
  }, [selectedCategories, priceRange, overallMaxPrice, currentPage]);

  const toggleSection = (sec: keyof typeof expandedSections) =>
    setExpandedSections((prev) => ({ ...prev, [sec]: !prev[sec] }));

  const handleCategoryChange = (categoryId: string) => {
    // 1) tìm node tương ứng
    const findNode = (nodes: Category[]): Category | null => {
      for (const n of nodes) {
        if (n._id === categoryId) return n;
        if (n.children) {
          const hit = findNode(n.children);
          if (hit) return hit;
        }
      }
      return null;
    };
    
    const node = findNode(categories);
    if (!node) return;

    // 2) lấy tất cả leaf của node
    const leafIds = getDescendantLeafIds(node);

    // 3) tính newSelected dựa trên prevSelected
    let newSelected: string[];
    if (node.children && node.children.length) {
      // toggle parent: chọn/deselect tất cả leaf
      const anySel = leafIds.some((id) => selectedCategories.includes(id));
      newSelected = anySel ? selectedCategories.filter((id) => !leafIds.includes(id)) : Array.from(new Set([...selectedCategories, ...leafIds]));
    } else {
      // toggle leaf đơn lẻ
      newSelected = selectedCategories.includes(categoryId)
        ? selectedCategories.filter((id) => id !== categoryId)
        : [...selectedCategories, categoryId];
    }
    setCurrentPage(1);
    // 4) cập nhật state và URL
    setSelectedCategories(newSelected);
    const qp = new URLSearchParams(searchParams);
    qp.set("category", newSelected.join(","));
    setSearchParams(qp, { replace: true });
  };

  const handlePriceRangeChange = useCallback((min: number, max: number) => {
    setCurrentPage(1);
    setPriceRange({ min, max });
  }, []);

  return (
    <div className="product-list">
      <div className="container">
        <div className="header">
          <h1 className="title">PRODUCTS</h1>

          <div className="header-right">
            <p className="results-count">{products.length} RESULTS</p>
            <button
              className="filter-toggle"
              onClick={() => setIsMobileFiltersOpen((o) => !o)}
            >
              <Filter size={20} /> <span>Filters</span>
            </button>
          </div>
        </div>

        <div className="layout">
          <div
            className={`sidebar ${isMobileFiltersOpen ? "mobile-open" : ""}`}
          >
            <div className="sidebar-header">
              <h2>Filters</h2>
              <button
                className="close-filters"
                onClick={() => setIsMobileFiltersOpen(false)}
              >
                ×
              </button>
            </div>

            <SidebarFilter
              categories={categories}
              selected={selectedCategories}
              onSelect={handleCategoryChange}
              activeTab={activeTab}
            />

            <div className="filter-section">
              <button
                className="filter-header"
                onClick={() => toggleSection("priceRange")}
                aria-expanded={expandedSections.priceRange}
              >
                PRICE RANGE
                <ChevronDown
                  className={`filter-icon ${
                    expandedSections.priceRange ? "expanded" : ""
                  }`}
                  size={20}
                />
              </button>
              <div
                className={`filter-content ${
                  expandedSections.priceRange ? "expanded" : ""
                }`}
              >
                <PriceRangeSlider
                  min={0}
                  max={overallMaxPrice}
                  onPriceChange={handlePriceRangeChange}
                />
              </div>
            </div>
          </div>

          <div className="product-list-content">
            <div
              className="pagination"
              style={{ textAlign: "center", margin: "16px 0" }}
            >
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(Math.max(1, currentPage - 5))}
              >
                <KeyboardDoubleArrowLeft fontSize="small" />
              </button>
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                <KeyboardArrowLeft />
              </button>
              <span style={{ margin: "0 12px" }}>
                Trang{" "}
                <strong>
                  {currentPage} / {totalPages}
                </strong>
              </span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                <KeyboardArrowRight />
              </button>
              <button
                disabled={currentPage + 5 > totalPages}
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 5))
                }
              >
                <KeyboardDoubleArrowRight fontSize="small" />
              </button>
            </div>

            <div className="product-grid">
              {loading ? (
                <div className="loading">Loading...</div>
              ) : (
                products.map((p) => (
                  <ProductCard
                    key={p.id}
                    id={p.id}
                    image={p.imageUrl}
                    title={p.name}
                    price={p.price}
                    stock={p.type === "pet" ? (p.stock > 0 ? 1 : 0) : p.stock}
                    type={p.type}
                    inCartQty={cartQtyById[p.id] || 0}
                    onAdd={() => {
                      if (p.type === "pet" && cartItemIds.includes(p.id)) {
                        showToast(
                          "Bạn đã thêm thú cưng này vào giỏ hàng rồi",
                          "info"
                        );
                      } else {
                        handleAdd(p.id);
                      }
                    }}
                    isInWishlist={wishlistItemIds.has(p.id)}
                    onToggleWishlist={handleToggleWishlist}
                    isWishlistLoading={wishlistLoadingIds.has(p.id)}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
