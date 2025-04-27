import React, { useState, useEffect } from "react";
import { Menu, ArrowLeft, ChevronRight } from "lucide-react";
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
    const [isOpen, setIsOpen] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [activeMenus, setActiveMenus] = useState<string[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/categories');
                if (response.data?.success) {
                    const petCategories: Category[] = response.data.data
                        .filter((cat: any) => cat.type === 'pet')
                        .map((cat: any) => ({ ...cat, type: 'pet' }));
                    const toolCategories: Category[] = response.data.data
                        .filter((cat: any) => cat.type === 'tool')
                        .map((cat: any) => ({ ...cat, type: 'tool' }));

                    const categoriesWithSubs = STATIC_TABS.map(tab => ({
                        ...tab,
                        subcategories: tab.type === 'pet' ? petCategories : toolCategories
                    }));

                    setCategories(categoriesWithSubs);
                }
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
        setActiveMenus([]);
    };

    const handleMenuClick = (categoryId: string) => {
        setActiveMenus(prev => {
            const index = prev.indexOf(categoryId);
            if (index > -1) {
                return prev.filter(id => id !== categoryId);
            }
            return [...prev, categoryId];
        });
    };

    const renderMenuItems = (items: Category[], level: number = 0) => {
        return (
            <ul className={`pk-menu-list ${level > 0 ? 'pk-submenu' : ''}`}>
                {items.map((item) => (
                    <li key={item._id} className="pk-menu-item">
                        <button
                            className={`pk-menu-button ${activeMenus.includes(item._id) ? 'active' : ''}`}
                            onClick={() => handleMenuClick(item._id)}
                        >
                            <span>{item.name}</span>
                            {item.subcategories && item.subcategories.length > 0 && (
                                <ChevronRight 
                                    className={`pk-menu-arrow ${activeMenus.includes(item._id) ? 'rotated' : ''}`}
                                    size={18}
                                />
                            )}
                        </button>
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
