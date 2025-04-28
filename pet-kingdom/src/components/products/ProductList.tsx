import React, { useState, useEffect, useCallback } from 'react';
import { ChevronDown, Filter } from 'lucide-react';
import './ProductStyle.css';
import ProductCard from './ProductCard';
import api from '../../services/api/axiosConfig';
import { useSearchParams } from 'react-router-dom';
import PriceRangeSlider from './filters/PriceRangeSlider';

interface Category {
  _id: string;
  name: string;
  type: 'pet' | 'tool';
  description?: string;
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
  // Pet specific
  birthday?: string;
  gender?: 'male' | 'female';
  vaccinated?: boolean;
  // Tool specific  
  brand?: string;
}

interface FilterSectionProps {
  title: string;
  items: Category[];
  isExpanded: boolean;
  onToggle: () => void;
  onFilterChange: (categoryId: string) => void;
  selectedCategories: string[];
}

const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  items,
  isExpanded,
  onToggle,
  onFilterChange,
  selectedCategories
}) => {
  return (
    <div className="filter-section">
      <button
        className="filter-header"
        onClick={onToggle}
        aria-expanded={isExpanded}
      >
        {title}
        <ChevronDown className={`filter-icon ${isExpanded ? 'expanded' : ''}`} size={20} />
      </button>
      <div className={`filter-content ${isExpanded ? 'expanded' : ''}`}>
        <ul className="filter-list">
          {items.map((item) => (
            <li key={item._id}>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  className="checkbox-input"
                  onChange={() => onFilterChange(item._id)}
                  checked={selectedCategories.includes(item._id)}
                />
                <span className="checkbox-custom"></span>
                <span>{item.name}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};


export default function ProductList() {
  const [searchParams] = useSearchParams();
  const initialCategoryId = searchParams.get('category');
  const categoryName = searchParams.get('name');
  const [overallMaxPrice, setOverallMaxPrice] = useState(0);
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    priceRange: false
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategoryId ? [initialCategoryId] : []);
  const [priceRange, setPriceRange] = useState<{ min: number, max: number }>({
    min: 0,
    max: 10000000
  });
  const [loading, setLoading] = useState(true);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        if (response.data?.success) {
          setCategories(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Thêm useEffect mới để cập nhật selectedCategories khi URL thay đổi
  useEffect(() => {
    if (initialCategoryId) {
      setSelectedCategories([initialCategoryId]);
    }
  }, [initialCategoryId]);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const res = await api.get('/products');
        if (res.data.success) {
          const all: Product[] = res.data.data.products;
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

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params: any = {};
        if (selectedCategories.length > 0) {
          params.category = selectedCategories.join(',');
        }
        if (priceRange.min > 0) params.minPrice = priceRange.min;
        if (priceRange.max < 10000000) params.maxPrice = priceRange.max;

        const response = await api.get('/products', { params });
        if (response.data?.success) {
          setProducts(response.data.data.products);
        }
      } catch (err) {
        console.error('Error fetching all products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategories, priceRange]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      }
      return [...prev, categoryId];
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
              onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            >
              <Filter size={20} />
              <span>Filters</span>
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

            <FilterSection
              title="CATEGORIES"
              items={categories}
              isExpanded={expandedSections.categories}
              onToggle={() => toggleSection('categories')}
              onFilterChange={handleCategoryChange}
              selectedCategories={selectedCategories}
            />

            <div className="filter-section">
              <button
                className="filter-header"
                onClick={() => toggleSection('priceRange')}
                aria-expanded={expandedSections.priceRange}
              >
                PRICE RANGE
                <ChevronDown className={`filter-icon ${expandedSections.priceRange ? 'expanded' : ''}`} size={20} />
              </button>
              <div className={`filter-content ${expandedSections.priceRange ? 'expanded' : ''}`}>
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
              products.map((product) => (
                <ProductCard
                  key={product.id}
                  image={product.imageUrl}
                  title={product.name}
                  description={product.description}
                  price={product.price}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}