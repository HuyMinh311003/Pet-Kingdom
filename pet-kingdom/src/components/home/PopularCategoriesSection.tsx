import React from "react";
import "./HomeStyle.css";

export interface Category {
    name: string;
    image: string;
    count: string;
}

interface PopularCategoriesSectionProps {
    categories: Category[];
}

const PopularCategoriesSection: React.FC<PopularCategoriesSectionProps> = ({ categories }) => {
    return (
        <section id="categories-section" className="categories-section">
            <div className="section-container">
                <h2 className="section-title">Popular Categories</h2>
                <div className="categories-grid">
                    {categories.map((category, index) => (
                        <div key={index} className="category-card">
                            <img
                                src={category.image}
                                alt={category.name}
                                className="category-image"
                            />
                            <div className="category-overlay">
                                <h3 className="category-title">{category.name}</h3>
                                <p className="category-count">{category.count}</p>
                            </div>
                            <a
                                href="#"
                                className="category-link-overlay"
                            >
                                <span className="category-button">
                                    View Category
                                </span>
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PopularCategoriesSection;