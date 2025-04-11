import React, { useEffect, useState, useRef } from "react";
import { PawPrint as Paw, User, ShoppingCart, Search } from "lucide-react";
import "./HeaderStyle.css";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
    cartItems: number;
}

const Header: React.FC<HeaderProps> = ({ cartItems }) => {
    const [isSticky, setIsSticky] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const [searchValue, setSearchValue] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSearchOpen(false);
                setSearchValue("");
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
        navigate('/cart'); // Navigates to the Cart page
    };

    return (
        <header className={`main-header ${isSticky ? "sticky" : ""}`}>
            <div className="header-inner">
                <div className="logo" onClick={() => navigate("")}>
                    <Paw className="logo-icon" />
                    <span className="logo-title">Pally</span>
                </div>

                <div className="search-bar" ref={searchRef}>
                    <div
                        className={`search-wrapper ${isSearchOpen ? "active" : ""}`}
                        onClick={toggleSearch}
                    >
                        <Search className="search-icon" />
                        <input type="text" placeholder="Search..."
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                    </div>
                </div>

                <div className="header-icons">
                    <User onClick={() => navigate('/profile')} className="user-icon" />
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
