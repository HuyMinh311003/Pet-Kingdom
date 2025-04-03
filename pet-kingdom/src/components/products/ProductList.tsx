import React, { useState } from 'react';
import { ChevronDown, Filter } from 'lucide-react';
import './ProductStyle.css';
import ProductCard from './ProductCard';

const products = [
    {
        id: 1,
        title: "Premium Dog Bed",
        description: "High-quality and comfortable dog bed for your pet.",
        price: 175.00,
        image: "https://images.unsplash.com/photo-1591946614720-90a587da4a36?auto=format&fit=crop&q=80&w=800",
    },
    {
        id: 1,
        title: "Premium Dog Bed",
        description: "High-quality and comfortable dog bed for your pet.",
        price: 175.00,
        image: "https://images.unsplash.com/photo-1591946614720-90a587da4a36?auto=format&fit=crop&q=80&w=800",
    },
    {
        id: 1,
        title: "Premium Dog Bed",
        description: "High-quality and comfortable dog bed for your pet.",
        price: 175.00,
        image: "https://images.unsplash.com/photo-1591946614720-90a587da4a36?auto=format&fit=crop&q=80&w=800",
    },
    {
        id: 1,
        title: "Premium Dog Bed",
        description: "High-quality and comfortable dog bed for your pet.",
        price: 175.00,
        image: "https://images.unsplash.com/photo-1591946614720-90a587da4a36?auto=format&fit=crop&q=80&w=800",
    },
    {
        id: 1,
        title: "Premium Dog Bed",
        description: "High-quality and comfortable dog bed for your pet.",
        price: 175.00,
        image: "https://images.unsplash.com/photo-1591946614720-90a587da4a36?auto=format&fit=crop&q=80&w=800",
    },
    {
        id: 1,
        title: "Premium Dog Bed",
        description: "High-quality and comfortable dog bed for your pet.",
        price: 175.00,
        image: "https://images.unsplash.com/photo-1591946614720-90a587da4a36?auto=format&fit=crop&q=80&w=800",
    },
    {
        id: 1,
        title: "Premium Dog Bed",
        description: "High-quality and comfortable dog bed for your pet.",
        price: 175.00,
        image: "https://images.unsplash.com/photo-1591946614720-90a587da4a36?auto=format&fit=crop&q=80&w=800",
    },
];

const categories = [
    "BEDS",
    "CARRIERS",
    "TOYS",
    "GROOMING",
    "FOOD & TREATS",
    "HEALTH & WELLNESS",
    "TRAINING",
    "ACCESSORIES"
];

const designers = [
    "Premium Pets",
    "Luxury Tails",
    "Pet Paradise",
    "Royal Canine",
    "Pawfect"
];

interface FilterSectionProps {
    title: string;
    items: string[];
    isExpanded: boolean;
    onToggle: () => void;
}



const FilterSection: React.FC<FilterSectionProps> = ({ title, items, isExpanded, onToggle }) => {
    return (
        <div className="filter-section">
            <button
                className="filter-header"
                onClick={onToggle}
                aria-expanded={isExpanded}
            >
                {title}
                <ChevronDown className={`filter-icon ${isExpanded ? 'expanded' : ''}`} size={20} />
            </button>
            <div className={`filter-content ${isExpanded ? 'expanded' : ''}`}>
                <ul className="filter-list">
                    {items.map((item) => (
                        <li key={item}>
                            <label className="checkbox-label">
                                <input type="checkbox" className="checkbox-input" />
                                <span className="checkbox-custom"></span>
                                <span>{item}</span>
                            </label>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default function ProductList() {
    const [expandedSections, setExpandedSections] = useState({
        categories: true,
        designers: true,
        price: false,
        sizes: false,
        materials: false,
    });

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);


    return (
        <div className="product-list">
            <div className="breadcrumb">
                <div className="breadcrumb-list">
                    <a href="/" className="breadcrumb-link">HOME PAGE</a>
                    <span className="breadcrumb-separator">→</span>
                    <a href="/new" className="breadcrumb-link">NEW ARRIVAL</a>
                    <span className="breadcrumb-separator">→</span>
                    <span className="breadcrumb-current">PET PRODUCTS</span>
                </div>
            </div>

            <div className="container">
                <div className="header">
                    <h1 className="title">PET PRODUCTS</h1>
                    <div className="header-right">
                        <p className="results-count">230 RESULTS</p>
                        <button
                            className="filter-toggle"
                            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                        >
                            <Filter size={20} />
                            <span>Filters</span>
                        </button>
                    </div>
                </div>

                <div className="layout">
                    <div className={`sidebar ${isMobileFiltersOpen ? 'mobile-open' : ''}`}>
                        <div className="sidebar-header">
                            <h2>Filters</h2>
                            <button
                                className="close-filters"
                                onClick={() => setIsMobileFiltersOpen(false)}
                            >
                                ×
                            </button>
                        </div>
                        <FilterSection
                            title="CATEGORIES"
                            items={categories}
                            isExpanded={expandedSections.categories}
                            onToggle={() => toggleSection('categories')}
                        />
                        <FilterSection
                            title="DESIGNERS"
                            items={designers}
                            isExpanded={expandedSections.designers}
                            onToggle={() => toggleSection('designers')}
                        />
                        <FilterSection
                            title="PRICE RANGE"
                            items={[]}
                            isExpanded={expandedSections.price}
                            onToggle={() => toggleSection('price')}
                        />
                        <FilterSection
                            title="SIZES"
                            items={[]}
                            isExpanded={expandedSections.sizes}
                            onToggle={() => toggleSection('sizes')}
                        />
                        <FilterSection
                            title="MATERIALS"
                            items={[]}
                            isExpanded={expandedSections.materials}
                            onToggle={() => toggleSection('materials')}
                        />
                    </div>

                    <div className="product-grid">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                image={product.image}
                                title={product.title}
                                description={product.description}
                                price={product.price}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}