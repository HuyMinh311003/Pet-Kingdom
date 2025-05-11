import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronDown, Filter } from 'lucide-react';
import './ProductStyle.css';
import ProductCard from './ProductCard';
import api from '../../services/admin-api/axiosConfig';
import { useSearchParams } from 'react-router-dom';
import PriceRangeSlider from './filters/PriceRangeSlider';
import SidebarFilter, { Category } from './SidebarFilter';
import { cartApi, productsApi } from '../../services/customer-api/api';
import ReCAPTCHA from 'react-google-recaptcha';

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  type: 'pet' | 'tool';
  available: number;
  birthday?: string;
  gender?: 'male' | 'female';
  vaccinated?: boolean;
  brand?: string;
}

export default function ProductList() {
  const [searchParams] = useSearchParams();
  const initialCategoryId = searchParams.get('category');
  const categoryName = searchParams.get('name');
  const isFirstFilterRun = useRef(true);

  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [pendingAdd, setPendingAdd] = useState<string | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<'pet' | 'tool'>('pet');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategoryId ? [initialCategoryId] : []
  );

  const [overallMaxPrice, setOverallMaxPrice] = useState(0);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000000 });
  const [expandedSections, setExpandedSections] = useState({
    priceRange: false
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const tryAddToCart = async (productId: string, captchaToken?: string) => {
    const userId = localStorage.getItem('userId')!;
    return cartApi.addItem(userId, productId, 1, captchaToken);
  };

  // xử lý khi click ADD
  const handleAdd = async (productId: string) => {
    // kiểm auth/role nếu cần
    const token = localStorage.getItem("token");
    if (!token) { /* redirect login */ return; }
    const role = localStorage.getItem("userRole");
    if (role !== "Customer") {
      alert("Chỉ Customer mới được thêm vào giỏ hàng");
      return;
    }

    try {
      // 5 lần đầu → ok
      await tryAddToCart(productId);
      alert("Đã thêm vào giỏ hàng");
      fetchProducts(); // hoặc whatever onAddSuccess của bạn
    } catch (err: any) {
      const status = err.response?.status;
      const msg = err.response?.data?.message;
      // server trả 429 + "Captcha required" → bật widget
      if (status === 429 && msg === 'Captcha required') {
        setPendingAdd(productId);
        recaptchaRef.current?.execute();
        return;
      }
      alert(msg || "Thêm vào giỏ hàng thất bại");
    }
  };

  // callback khi CAPTCHA resolve xong
  const onCaptchaResolved = async (captchaToken: string | null) => {
    if (!captchaToken || !pendingAdd) {
      alert("Vui lòng hoàn thành CAPTCHA");
      recaptchaRef.current?.reset();
      setPendingAdd(null);
      return;
    }
    try {
      await tryAddToCart(pendingAdd, captchaToken);
      alert("Đã thêm vào giỏ hàng");
      fetchProducts();
    } catch (err: any) {
      alert(err.response?.data?.message || "Xác thực CAPTCHA thất bại");
    } finally {
      recaptchaRef.current?.reset();
      setPendingAdd(null);
    }
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await productsApi.getProducts();
      // giả sử API trả về { success, data: { products: Product[] } }
      if (res.data.success) {
        setProducts(res.data.data.products);
      }
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        // song song lấy categories và all products
        const [catRes, prodRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products'),
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
        console.error('Error fetching initial data:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchInitialData();
    return () => { mounted = false; };
  }, []);


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
        if (selectedCategories.length) params.category = selectedCategories.join(',');
        if (priceRange.min > 0) params.minPrice = priceRange.min;
        if (priceRange.max < overallMaxPrice) params.maxPrice = priceRange.max;

        const res = await api.get('/products', { params });
        if (res.data.success) {
          setProducts(res.data.data.products);
        }
      } catch (err) {
        console.error('Error fetching filtered products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFiltered();
  }, [selectedCategories, priceRange, overallMaxPrice]);


  const toggleSection = (sec: keyof typeof expandedSections) =>
    setExpandedSections(prev => ({ ...prev, [sec]: !prev[sec] }));

  // helper: lấy tất cả descendant leaf IDs
  const getDescendantLeafIds = (cat: Category): string[] => {
    if (!cat.children || !cat.children.length) {
      return [cat._id];
    }
    return cat.children.flatMap(c => getDescendantLeafIds(c));
  };

  // select/unselect logic
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories(prev => {
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
        const anySel = leafIds.some(id => prev.includes(id));
        return anySel
          ? prev.filter(id => !leafIds.includes(id))
          : Array.from(new Set([...prev, ...leafIds]));
      } else {
        // leaf toggle đơn lẻ
        return prev.includes(categoryId)
          ? prev.filter(id => id !== categoryId)
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
          <h1 className="title">{categoryName || 'PET PRODUCTS'}</h1>
          <div className="header-right">
            <p className="results-count">{products.length} RESULTS</p>
            <button
              className="filter-toggle"
              onClick={() => setIsMobileFiltersOpen(o => !o)}
            >
              <Filter size={20} /> <span>Filters</span>
            </button>
          </div>
        </div>

        <div className="layout">
          <div className={`sidebar ${isMobileFiltersOpen ? 'mobile-open' : ''}`}>
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
                onClick={() => toggleSection('priceRange')}
                aria-expanded={expandedSections.priceRange}
              >
                PRICE RANGE
                <ChevronDown
                  className={`filter-icon ${expandedSections.priceRange ? 'expanded' : ''
                    }`}
                  size={20}
                />
              </button>
              <div
                className={`filter-content ${expandedSections.priceRange ? 'expanded' : ''
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
              products.map(p => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  image={p.imageUrl}
                  title={p.name}
                  description={p.description}
                  price={p.price}
                  stock={p.available}
                  type={p.type}
                  onAdd={() => { handleAdd(p.id); }}
                />
              ))
            )}
          </div>
          <ReCAPTCHA
            sitekey={RECAPTCHA_SITE_KEY}
            size="invisible"
            ref={recaptchaRef}
            onChange={onCaptchaResolved}
            onErrored={() => alert("Không thể tải CAPTCHA")}
            onExpired={() => {
              alert("CAPTCHA hết hạn, vui lòng thử lại");
              recaptchaRef.current?.reset();
            }}
          />
        </div>
      </div>
    </div>
  );
}
