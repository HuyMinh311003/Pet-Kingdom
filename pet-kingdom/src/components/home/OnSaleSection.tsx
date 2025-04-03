import React from "react";
import "./HomeStyle.css";
import { useCart } from "../../contexts/CartContext";

export interface OnSaleProduct {
    id: number;
    name: string;
    image: string;
    originalPrice: number;
    salePrice: number;
}

interface OnSaleSectionProps {
    saleProducts: OnSaleProduct[];
}

const OnSaleSection: React.FC<OnSaleSectionProps> = ({ saleProducts }) => {
    const { setCartItems, cartItems } = useCart();

    const handleAddToCart = () => {
        setCartItems(cartItems + 1);
    };
    return (
        <section id="sale-section" className="sale-section">
            <div className="section-container">
                <h2 className="section-title">On Sale Products</h2>
                <div className="sale-grid">
                    {saleProducts.map((product) => (
                        <div key={product.id} className="sale-card">
                            <div className="sale-image-container">
                                <img src={product.image} alt={product.name} className="sale-image" />
                                <div className="sale-badge">
                                    SALE
                                </div>
                            </div>
                            <div className="sale-card-content">
                                <h3 className="sale-card-title">{product.name}</h3>
                                <div className="sale-price-container">
                                    <span className="sale-original-price">${product.originalPrice}</span>
                                    <span className="sale-price">${product.salePrice}</span>
                                </div>
                                <button 
                                    className="sale-add-button"
                                    onClick={handleAddToCart}
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-12">
                    <button className="sale-view-button">
                        See All Sales
                    </button>
                </div>
            </div>
        </section>
    );
};

export default OnSaleSection;