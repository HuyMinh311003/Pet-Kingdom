import { useState, useEffect, useCallback } from 'react';
import { ChevronDown, Filter } from 'lucide-react';
import './ProductStyle.css';
import ProductCard from './ProductCard';
import api from '../../services/admin-api/axiosConfig';
import { useSearchParams } from 'react-router-dom';
import PriceRangeSlider from './filters/PriceRangeSlider';
import SidebarFilter, { Category as CatType } from './SidebarFilter';

interface Category {
  _id: string;
  name: string;
  type: 'pet' | 'tool';
  parent: string | null;
  children?: Category[];
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  type: 'pet' | 'tool';
  stock: number;
  birthday?: string;
  gender?: 'male' | 'female';
  vaccinated?: boolean;
  brand?: string;
}

export default function ProductList() {
  const [searchParams] = useSearchParams();
  const initialCategoryId = searchParams.get('category');
  const categoryName = searchParams.get('name');

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

  // 1) Load categories (nested)
  useEffect(() => {
    api.get('/categories').then(res => {
      const tree = res.data.data as CatType[];
      setCategories(tree);
    });
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

  // 3) Load toàn bộ products để tính overallMaxPrice
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const res = await api.get('/products');
        if (res.data.success) {
          const all = res.data.data.products as Product[];
          const maxPrice = all.reduce((mx, p) => Math.max(mx, p.price), 0);
          setOverallMaxPrice(maxPrice);
          setPriceRange({ min: 0, max: maxPrice });
        }
      } catch (err) {
        console.error('Error fetching all products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // 4) Load products theo filter category + priceRange
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params: any = {};
        if (selectedCategories.length) {
          params.category = selectedCategories.join(',');
        }
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
    fetchProducts();
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
                  className={`filter-icon ${
                    expandedSections.priceRange ? 'expanded' : ''
                  }`}
                  size={20}
                />
              </button>
              <div
                className={`filter-content ${
                  expandedSections.priceRange ? 'expanded' : ''
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
                  image={p.imageUrl}
                  title={p.name}
                  description={p.description}
                  price={p.price}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
