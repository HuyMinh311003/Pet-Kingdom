import React, { useState } from "react";
import { Menu, ArrowLeft } from "lucide-react";
import "./HamburgerStyle.css";

const HamburgerSection: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
    const [openLevel3, setOpenLevel3] = useState<string | null>(null);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
        setOpenSubmenu(null);
        setOpenLevel3(null);
    };

    const handleMenuItemClick = (submenu: string) => {
        setOpenSubmenu(openSubmenu === submenu ? null : submenu);
        setOpenLevel3(null);
    };

    const handleLevel3MenuClick = (submenu: string) => {
        setOpenLevel3(openLevel3 === submenu ? null : submenu);
    };

    return (
        <div className="hamburger-menu-container">
            {!isOpen && (
                <button className="hamburger-btn" onClick={toggleMenu}>
                    <Menu className="hamburger-icon" />
                </button>
            )}

            {isOpen && <div className="menu-overlay" onClick={toggleMenu} />}

            {isOpen && (
                <>
                    <button className="close-sidebar-btn" onClick={toggleMenu}>
                        <ArrowLeft className="hamburger-icon" />
                    </button>
                    <div className="sidebar-menu">
                        <ul className="menu-level-1">
                            <li
                                className={`menu-item ${openSubmenu === "thucung" ? "active" : ""}`}
                                tabIndex={0}
                                onClick={() => handleMenuItemClick("thucung")}
                            >
                                Thú cưng <span className="arrow">▼</span>
                            </li>
                            <li
                                className={`menu-item ${openSubmenu === "vatdung" ? "active" : ""}`}
                                tabIndex={0}
                                onClick={() => handleMenuItemClick("vatdung")}
                            >
                                Vật dụng chăm sóc <span className="arrow">▼</span>
                            </li>
                        </ul>
                    </div>
                </>
            )}

            {openSubmenu === "thucung" && (
                <div
                    className="detached-submenu"
                    style={{ top: 80, left: 260, opacity: 1, visibility: "visible", transform: "translateX(0)" }}
                >
                    <ul className="menu-level-2">
                        <li
                            className="menu-item"
                            tabIndex={0}
                            onClick={() => handleLevel3MenuClick("cho")}
                        >
                            Chó <span className="arrow">▼</span>
                        </li>
                        <li
                            className="menu-item"
                            tabIndex={0}
                            onClick={() => handleLevel3MenuClick("meo")}
                        >
                            Mèo <span className="arrow">▼</span>
                        </li>
                    </ul>
                </div>
            )}

            {openSubmenu === "vatdung" && (
                <div
                    className="detached-submenu"
                    style={{ top: 120, left: 260, opacity: 1, visibility: "visible", transform: "translateX(0)" }}
                >
                    <ul className="menu-level-2">
                        <li
                            className="menu-item"
                            tabIndex={0}
                            onClick={() => handleLevel3MenuClick("thucan")}
                        >
                            Thức ăn <span className="arrow">▼</span>
                        </li>
                        <li
                            className="menu-item"
                            tabIndex={0}
                            onClick={() => handleLevel3MenuClick("vatdung-detail")}
                        >
                            Vật dụng <span className="arrow">▼</span>
                        </li>
                    </ul>
                </div>
            )}

            {/* Các level 3 khác */}
            {openLevel3 === "cho" && (
                <div
                    className="detached-submenu"
                    style={{ top: 120, left: 460, opacity: 1, visibility: "visible", transform: "translateX(0)" }}
                >
                    <ul className="menu-level-3">
                        <li className="menu-item" tabIndex={0}>Chó giống A</li>
                        <li className="menu-item" tabIndex={0}>Chó giống B</li>
                    </ul>
                </div>
            )}

            {openLevel3 === "meo" && (
                <div
                    className="detached-submenu"
                    style={{ top: 160, left: 460, opacity: 1, visibility: "visible", transform: "translateX(0)" }}
                >
                    <ul className="menu-level-3">
                        <li className="menu-item" tabIndex={0}>Mèo giống X</li>
                        <li className="menu-item" tabIndex={0}>Mèo giống Y</li>
                    </ul>
                </div>
            )}

            {openLevel3 === "thucan" && (
                <div
                    className="detached-submenu"
                    style={{ top: 160, left: 460, opacity: 1, visibility: "visible", transform: "translateX(0)" }}
                >
                    <ul className="menu-level-3">
                        <li className="menu-item" tabIndex={0}>Thức ăn loại 1</li>
                        <li className="menu-item" tabIndex={0}>Thức ăn loại 2</li>
                    </ul>
                </div>
            )}

            {openLevel3 === "vatdung-detail" && (
                <div
                    className="detached-submenu"
                    style={{ top: 200, left: 460, opacity: 1, visibility: "visible", transform: "translateX(0)" }}
                >
                    <ul className="menu-level-3">
                        <li className="menu-item" tabIndex={0}>Vật dụng loại A</li>
                        <li className="menu-item" tabIndex={0}>Vật dụng loại B</li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default HamburgerSection;