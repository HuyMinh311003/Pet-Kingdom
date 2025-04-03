import React, { useEffect, useState } from "react";
import { PawPrint as Paw, User, ShoppingCart, Search } from "lucide-react";
import "./HeaderStyle.css";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
    cartItems: number;
}

const Header: React.FC<HeaderProps> = ({ cartItems }) => {
    const [isSticky, setIsSticky] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setIsSticky(scrollTop > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    return (
        <header className={`main-header ${isSticky ? 'sticky' : ''}`}>
            <div className="header-inner">
                <div className="logo" onClick={() => navigate('')}>
                    <Paw className="logo-icon" />
                    <span className="logo-title">Pally</span>
                </div>
                <div className="search-bar">
                    <div className="search-wrapper">
                        <Search className="search-icon" />
                        <input type="text" placeholder="Search..." />
                    </div>
                </div>

                <div className="header-icons">
                    <User className="user-icon" />
                    <div className="cart-icon-container">
                        <ShoppingCart className="cart-icon" />
                        {cartItems > 0 && (
                            <span className="cart-count">
                                {cartItems}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;