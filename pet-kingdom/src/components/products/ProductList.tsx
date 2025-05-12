import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronDown, Filter } from 'lucide-react';
import './ProductStyle.css';
import ProductCard from './ProductCard';
import { api } from '../../services/customer-api/api';
import { useSearchParams } from 'react-router-dom';
import PriceRangeSlider from './filters/PriceRangeSlider';
import SidebarFilter, { Category } from './SidebarFilter';
import { cartApi, productsApi } from '../../services/customer-api/api';
import Toast, { ToastProps } from '../common/toast/Toast';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  type: 'pet' | 'tool';
  birthday?: string;
  gender?: "male" | "female";
  vaccinated?: boolean;
  brand?: string;
  stock: number;
}

export default function ProductList() {
  const [searchParams] = useSearchParams();
  const initialCategoryId = searchParams.get("category");
  const categoryName = searchParams.get("name");
  const isFirstFilterRun = useRef(true);

  const [cartItemIds, setCartItemIds] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<"pet" | "tool">("pet");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategoryId ? [initialCategoryId] : []
  );

  const [overallMaxPrice, setOverallMaxPrice] = useState(0);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000000 });
  const [expandedSections, setExpandedSections] = useState({
    priceRange: false,
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: ToastProps['severity'];
  }>({ open: false, message: '', severity: 'info' });
  const showToast = (
    message: string,
    severity: ToastProps['severity'] = 'info'
  ) => {
    setToast({ open: true, message, severity });
  };
  const handleToastClose = () => {
    setToast(t => ({ ...t, open: false }));
  };

  // xử lý khi click ADD
  const handleAdd = async (productId: string) => {
    // kiểm auth/role nếu cần
    const token = localStorage.getItem("token");
    if (!token) { /* redirect login */ return; }
    const role = localStorage.getItem("userRole");
    if (role !== "Customer") {
      showToast('Chỉ Customer mới được thêm vào giỏ hàng', 'warning')
      return;
    }

    try {
      const userId = localStorage.getItem('userId')!;
      await cartApi.addItem(userId, productId, 1);
      showToast('Đã thêm vào giỏ hàng', 'success');
      await Promise.all([fetchCart(), fetchProducts()]);
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Thêm vào giỏ hàng thất bại', 'error');
    }
  };


  const fetchCart = useCallback(async () => {
    const userId = localStorage.getItem('userId')!;
    try {
      const res = await cartApi.getCart(userId);
      if (res.data.success) {
        const ids = res.data.data.items.map((i: any) => i.product.id);
        setCartItemIds(ids);
      }
    } catch (err) {
      console.error('Error loading cart:', err);
    }
  }, []);


  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await productsApi.getProducts();
      if (res.data.success) {
        setProducts(res.data.data.products);
      }
      await fetchCart();
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchCart]);

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
        await fetchCart();
      } catch (err) {
        console.error("Error fetching initial data:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchInitialData();
    return () => { mounted = false; };
  }, [fetchCart]);


  // 2) Khi categories load xong, nếu có initialCategoryId thì set activeTab và selectedCategories
  useEffect(() => {
    if (!categories.length || !initialCategoryId) return;

    // tìm node bất kỳ trong cây
    const findNode = (nodes: Category[]): Category | null => {
      for (const n of nodes) {
        if (n._id === initialCategoryId) return n;
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
      setSelectedCategories([initialCategoryId]);
    }
  }, [categories, initialCategoryId]);

  useEffect(() => {
    if (isFirstFilterRun.current) {
      isFirstFilterRun.current = false;
      return;
    }

    const fetchFiltered = async () => {
      setLoading(true);
      try {
        const params: any = {};
        if (selectedCategories.length)
          params.category = selectedCategories.join(",");
        if (priceRange.min > 0) params.minPrice = priceRange.min;
        if (priceRange.max < overallMaxPrice) params.maxPrice = priceRange.max;

        const res = await api.get("/products", { params });
        if (res.data.success) {
          setProducts(res.data.data.products);
        }
        await fetchCart();
      } catch (err) {
        console.error("Error fetching filtered products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFiltered();
  }, [selectedCategories, priceRange, overallMaxPrice, fetchCart]);


  const toggleSection = (sec: keyof typeof expandedSections) =>
    setExpandedSections((prev) => ({ ...prev, [sec]: !prev[sec] }));

  // helper: lấy tất cả descendant leaf IDs
  const getDescendantLeafIds = (cat: Category): string[] => {
    if (!cat.children || !cat.children.length) {
      return [cat._id];
    }
    return cat.children.flatMap((c) => getDescendantLeafIds(c));
  };

  // select/unselect logic
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories((prev) => {
      // tìm node
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
      if (!node) return prev;

      const leafIds = getDescendantLeafIds(node);

      if (node.children && node.children.length) {
        // parent toggle => select/unselect tất cả leaf
        const anySel = leafIds.some((id) => prev.includes(id));
        return anySel
          ? prev.filter((id) => !leafIds.includes(id))
          : Array.from(new Set([...prev, ...leafIds]));
      } else {
        // leaf toggle đơn lẻ
        return prev.includes(categoryId)
          ? prev.filter((id) => id !== categoryId)
          : [...prev, categoryId];
      }
    });
  };

  const handlePriceRangeChange = useCallback((min: number, max: number) => {
    setPriceRange({ min, max });
  }, []);

  return (
    <div className="product-list">
      <div className="container">
        <div className="header">
          <h1 className="title">{categoryName || "PET PRODUCTS"}</h1>
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
                  stock={p.type === 'pet' ? (p.stock > 0 ? 1 : 0) : p.stock}
                  type={p.type}
                  inCart={cartItemIds.includes(p.id)}
                  onAdd={() => {
                    if (p.type === 'pet' && cartItemIds.includes(p.id)) {
                      showToast('Bạn đã thêm thú cưng này vào giỏ hàng rồi', 'info');
                    } else {
                      handleAdd(p.id);
                    }
                  }}
                />
              ))
            )}
          </div>
        </div>
      </div>
      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={handleToastClose}
      />
    </div>
  );
}
