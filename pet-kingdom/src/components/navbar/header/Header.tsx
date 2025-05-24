import React, { useEffect, useState, useRef, useCallback } from "react";
import { PawPrint as Paw, User, ShoppingCart, Search } from "lucide-react";
import "./HeaderStyle.css";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../contexts/ToastContext";
import { productApi } from '../../../services/admin-api/productApi';
import { debounce } from 'lodash';
import { formatPrice } from '../../../utils/format';

interface HeaderProps {
  cartItems: number;
}

const Header: React.FC<HeaderProps> = ({ cartItems }) => {
  const navigate = useNavigate();
  const [isSticky, setIsSticky] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const { showToast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
        setSearchQuery("");
        setSearchResults([]);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const toggleSearch = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isSearchOpen) {
      setIsSearchOpen(true);
    }
  };

  const handleCartClick = () => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      showToast("Chỉ khách hàng đã đăng nhập mới có thể truy cập", "warning");
      return;
    }
    const userRole = JSON.parse(stored);
    if (userRole.role != "Customer") {
      showToast("Chỉ Customer mới được truy cập", "warning");
      navigate("/");
      return;
    }
    navigate("/cart"); // Navigates to the Cart page
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (query.length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const response = await productApi.searchProducts(query);
        if (response.success) {
          setSearchResults(response.data);
        }
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 800),
    []
  );

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  // Handle search result click
  const handleResultClick = (productId: string) => {
    navigate(`/products/${productId}`);
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <header className={`main-header ${isSticky ? "sticky" : ""}`}>
      <div className="header-inner">
        <div className="logo" onClick={() => navigate("")}>
          <Paw className="logo-icon" />
          <span className="logo-title">PetKingdom</span>
        </div>

        <div className="search-bar" ref={searchRef}>
          <div
            className={`search-wrapper ${isSearchOpen ? "active" : ""}`}
            onClick={toggleSearch}
          >
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            
            {/* Search Results Dropdown */}
            {searchQuery.length >= 2 && (
              <div className="search-results">
                {isSearching ? (
                  <div className="search-loading">Đang tìm kiếm...</div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((product: any) => (
                    <div
                      key={product._id}
                      className="search-result-item"
                      onClick={() => handleResultClick(product._id)}
                    >
                      <div className="search-image-container">
                        <img className="search-result-image"
                          src={product.imageUrl}
                          alt={product.name}
                        />
                      </div>
                      <div className="search-result-content">
                        <div className="search-result-name">{product.name}</div>
                        <div className="search-result-price">{formatPrice(product.price)}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="search-no-results">Không tìm thấy sản phẩm</div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="header-icons">
          <User onClick={() => navigate("/profile")} className="user-icon" />
          <div className="cart-icon-container" onClick={handleCartClick}>
            <ShoppingCart className="cart-icon" />
            {cartItems > 0 && <span className="cart-count">{cartItems}</span>}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
