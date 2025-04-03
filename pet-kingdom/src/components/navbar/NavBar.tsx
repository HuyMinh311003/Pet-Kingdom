import React, { useEffect, useState } from "react";
import "./NavBarStyle.css";
import HamburgerSection from "./hamburger/HamburgerSection";

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
                <button className="nav-link" onClick={() => scrollToSection("hero-section")}>Home</button>
                <button className="nav-link" onClick={() => scrollToSection("intro-section")}>Intro</button>
                <button className="nav-link" onClick={() => scrollToSection("breeds-section")}>Breeds</button>
                <button className="nav-link" onClick={() => scrollToSection("pet-care-section")}>Pet Care</button>
                <button className="nav-link" onClick={() => scrollToSection("sale-section")}>Sales</button>
                <button className="nav-link" onClick={() => scrollToSection("categories-section")}>Categories</button>
            </nav>
        </div>
    );
};

export default NavBar;