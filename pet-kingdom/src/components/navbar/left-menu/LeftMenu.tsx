import React, { useState, useEffect } from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LeftMenuStyle.css";
import { Category } from "../../../types/category";
import { STATIC_TABS } from "../../../constants/categories";



const LeftMenu: React.FC = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [activeMenus, setActiveMenus] = useState<string[]>([]);
    const [loadedTypes, setLoadedTypes] = useState<Set<'pet' | 'tool'>>(new Set());

    const fetchCategoriesByType = async (type: 'pet' | 'tool') => {
        if (loadedTypes.has(type)) return;
        try {
            const response = await axios.get(`/api/categories?type=${type}`);
            if (response.data?.success) {
                const fetched: any[] = response.data.data;

                const normalize = (cats: any[]): Category[] =>
                    cats.map(cat => ({
                        _id: cat._id,
                        name: cat.name,
                        type,
                        isActive: cat.isActive,
                        children: cat.children ? normalize(cat.children) : []
                    }));

                const mapped = normalize(fetched);

                setCategories(prev => {
                    const updated = [...prev];
                    const staticTab = updated.find(c => c.type === type);
                    if (staticTab) staticTab.children = mapped;
                    return updated;
                });

                setLoadedTypes(prev => new Set(prev).add(type));
            }
        } catch (err) {
            console.error(err);
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
        if (category._id === 'pets' || category._id === 'accessories') {
            const type = category.type;
            await fetchCategoriesByType(type);
        }

        if (isChevronClick) {
            setActiveMenus(prev => {
                const index = prev.indexOf(category._id);
                if (index > -1) {
                    return prev.filter(id => id !== category._id);
                }
                return [...prev, category._id];
            });
        } else {
            if (category._id !== 'pets' && category._id !== 'accessories') {
                navigate(`/products?category=${category._id}&name=${category.name}`);
                toggleMenu(); // Close menu after navigation
            }
        }
    };

    const renderMenuItems = (items: Category[], level: number = 0) => {
        return (
            <ul className={`pk-menu-list level-${level}`}>
                {items.map(item => {
                    const nested = item.children || [];
                    const isTypeTab = level === 0 && (item._id === 'pets' || item._id === 'accessories');
                    const canExpand = nested.length > 0 || isTypeTab;

                    return (
                        <li
                            key={item._id}
                            className="pk-menu-item"
                            // indent động theo level, giống SidebarPreview
                            style={{ paddingLeft: `${level * 16}px` }}
                        >
                            <div className="pk-menu-button-container">
                                <span
                                    className="pk-menu-text"
                                    onClick={() => handleMenuClick(item, false)}
                                >
                                    {item.name}
                                </span>
                                {canExpand && (
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
                            {nested.length > 0 && (
                                <div
                                    className={`pk-submenu-container ${activeMenus.includes(item._id) ? 'open' : ''}`}
                                >
                                    {renderMenuItems(nested, level + 1)}
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
        );
    };


    return (
        <div className="pk-hamburger-menu-container">
            {!isOpen && (
                <button className="pk-hamburger-btn" onClick={toggleMenu}>
                    <ChevronRight className="pk-hamburger-icon pk-arrow-icon" />
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

export default LeftMenu;
