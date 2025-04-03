import React, { useEffect, useState } from "react";
import "./NavBarStyle.css";
import HamburgerSection from "./hamburger/HamburgerSection";
import { Heart, Home, Info, LayoutGrid, PawPrint, Tag } from "lucide-react";

const NavBar: React.FC = () => {
    const scrollToSection = (sectionId: string) => {
        const el = document.getElementById(sectionId);
        if (el) {
            el.scrollIntoView({ behavior: "smooth" });
        }
    };

    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setIsSticky(scrollTop > 50); // scroll bao nhiêu px thì sticky
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className={`navbar-container ${isSticky ? 'sticky' : ''}`}>
            <div className="navbar-left">
                <HamburgerSection />
            </div>
            <nav className="main-nav">
                {/* 
          Mỗi button hiển thị icon + text.
          Text sẽ ẩn trên mobile, icon vẫn hiển thị.
        */}
                <button className="nav-link" onClick={() => scrollToSection("hero-section")}>
                    <Home className="nav-link-icon" />
                    <span className="nav-link-text">Home</span>
                </button>
                <button className="nav-link" onClick={() => scrollToSection("breeds-section")}>
                    <PawPrint className="nav-link-icon" />
                    <span className="nav-link-text">Breeds</span>
                </button>
                <button className="nav-link" onClick={() => scrollToSection("pet-care-section")}>
                    <Heart className="nav-link-icon" />
                    <span className="nav-link-text">Pet Care</span>
                </button>
                <button className="nav-link" onClick={() => scrollToSection("sale-section")}>
                    <Tag className="nav-link-icon" />
                    <span className="nav-link-text">Sales</span>
                </button>
                <button className="nav-link" onClick={() => scrollToSection("categories-section")}>
                    <LayoutGrid className="nav-link-icon" />
                    <span className="nav-link-text">Categories</span>
                </button>
            </nav>
        </div>
    );
};

export default NavBar;