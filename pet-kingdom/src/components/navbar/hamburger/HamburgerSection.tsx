import React, { useState, useEffect } from "react";
import { Menu, ArrowLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./HamburgerStyle.css";

interface Category {
    _id: string;
    name: string;
    type: 'pet' | 'tool';
    isActive: boolean;
    subcategories?: Category[];
}

const STATIC_TABS: Category[] = [
    {
        _id: 'pets',
        name: 'Thú cưng',
        type: 'pet',
        isActive: true
    },
    {
        _id: 'accessories',
        name: 'Vật dụng',
        type: 'tool',
        isActive: true
    }
];

const HamburgerSection: React.FC = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [activeMenus, setActiveMenus] = useState<string[]>([]);
    const [loadedTypes, setLoadedTypes] = useState<Set<'pet' | 'tool'>>(new Set());

    const fetchCategoriesByType = async (type: 'pet' | 'tool') => {
        if (loadedTypes.has(type)) return;
        
        try {
            const response = await axios.get(`http://localhost:5000/api/categories?type=${type}`);
            if (response.data?.success) {
                const fetchedCategories = response.data.data.map((cat: any) => ({ 
                    ...cat, 
                    type: type 
                }));

                setCategories(prev => {
                    const updatedCategories = [...prev];
                    const staticTab = updatedCategories.find(cat => cat.type === type);
                    if (staticTab) {
                        staticTab.subcategories = fetchedCategories;
                    }
                    return updatedCategories;
                });

                setLoadedTypes(prev => new Set(prev).add(type));
            }
        } catch (error) {
            console.error(`Failed to fetch ${type} categories:`, error);
        }
    };

    useEffect(() => {
        setCategories(STATIC_TABS);
    }, []);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
        setActiveMenus([]);
    };

    const handleMenuClick = async (category: Category, isChevronClick: boolean) => {
        // If clicking on a main category (Thú cưng/Vật dụng), fetch its subcategories
        if (category._id === 'pets' || category._id === 'accessories') {
            const type = category.type;
            await fetchCategoriesByType(type);
        }

        if (isChevronClick) {
            // Only handle menu expansion
            setActiveMenus(prev => {
                const index = prev.indexOf(category._id);
                if (index > -1) {
                    return prev.filter(id => id !== category._id);
                }
                return [...prev, category._id];
            });
        } else {
            // Handle navigation
            if (category._id !== 'pets' && category._id !== 'accessories') {
                navigate(`/products?category=${category._id}`);
                toggleMenu(); // Close menu after navigation
            }
        }
    };

    const renderMenuItems = (items: Category[], level: number = 0) => {
        return (
            <ul className={`pk-menu-list ${level > 0 ? 'pk-submenu' : ''}`}>
                {items.map((item) => (
                    <li key={item._id} className="pk-menu-item">
                        <div className="pk-menu-button-container">
                            <span 
                                className="pk-menu-text"
                                onClick={() => handleMenuClick(item, false)}
                            >
                                {item.name}
                            </span>
                            {((item.subcategories?.length ?? 0) > 0 || item._id === 'pets' || item._id === 'accessories') && (
                                <button
                                    className="pk-chevron-button"
                                    onClick={() => handleMenuClick(item, true)}
                                >
                                    <ChevronRight 
                                        className={`pk-menu-arrow ${activeMenus.includes(item._id) ? 'rotated' : ''}`}
                                        size={18}
                                    />
                                </button>
                            )}
                        </div>
                        {item.subcategories && item.subcategories.length > 0 && (
                            <div className={`pk-submenu-container ${activeMenus.includes(item._id) ? 'open' : ''}`}>
                                {renderMenuItems(item.subcategories, level + 1)}
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div className="pk-hamburger-menu-container">
            {!isOpen && (
                <button className="pk-hamburger-btn" onClick={toggleMenu}>
                    <Menu className="pk-hamburger-icon" />
                </button>
            )}

            {isOpen && (
                <>
                    <div className="pk-hamburger-overlay" onClick={toggleMenu} />
                    <div className="pk-sidebar">
                        <button className="pk-close-btn" onClick={toggleMenu}>
                            <ArrowLeft className="pk-hamburger-icon" />
                        </button>
                        <div className="pk-sidebar-content">
                            {renderMenuItems(categories)}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default HamburgerSection;
