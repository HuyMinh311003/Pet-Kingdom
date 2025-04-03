import React from "react";
import "./HomeStyle.css";

export interface PetCareProduct {
    id: number;
    name: string;
    image: string;
    price: number;
}

interface PetCareAccessoriesSectionProps {
    petCareProducts: PetCareProduct[];
}

const PetCareAccessoriesSection: React.FC<PetCareAccessoriesSectionProps> = ({ petCareProducts }) => {
    return (
        <section id="pet-care-section" className="pet-care-section">
            <div className="section-container">
                <h2 className="section-title">Pet Care & Accessories</h2>
                <div className="pet-care-grid">
                    {petCareProducts.map((product) => (
                        <div key={product.id} className="product-card">
                            <div className="product-image-container">
                                <img src={product.image} alt={product.name} className="product-image" />
                                <div className="product-overlay">
                                    <button className="product-view-button">
                                        View Details
                                    </button>
                                </div>
                            </div>
                            <div className="product-card-content">
                                <h3 className="product-card-title">{product.name}</h3>
                                <p className="product-price">${product.price}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-12">
                    <button className="product-add-button">
                        View All Products
                    </button>
                </div>
            </div>
        </section>
    );
};

export default PetCareAccessoriesSection;