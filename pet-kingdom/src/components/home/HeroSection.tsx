import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./HomeStyle.css";
import { useNavigate } from "react-router-dom";
import LeftMenu from "../navbar/left-menu/LeftMenu";

export interface HeroSlide {
    image: string;
    title: string;
    subtitle: string;
}

interface HeroSectionProps {
    heroSlides: HeroSlide[];
    currentSlide: number;
    setCurrentSlide: React.Dispatch<React.SetStateAction<number>>;
}

const HeroSection: React.FC<HeroSectionProps> = ({ heroSlides, currentSlide, setCurrentSlide }) => {
    const navigate = useNavigate()
    return (
        <section id="hero-section" className="hero-section">
            <div
                className="hero-slide"
                style={{
                    backgroundImage: `url(${heroSlides[currentSlide].image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                }}
            >
                <div className="hero-overlay">
                    <div className="hero-content">
                        <div className="hero-text">
                            <h1 className="hero-title">{heroSlides[currentSlide].title}</h1>
                            <p className="hero-subtitle">{heroSlides[currentSlide].subtitle}</p>
                            <button onClick={() => navigate('/products')} className="hero-button">
                                Discover Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <button
                onClick={() => setCurrentSlide(prev => prev === 0 ? heroSlides.length - 1 : prev - 1)}
                className="hero-nav-btn hero-nav-btn--left"
            >
                <ChevronLeft className="nav-icon" />
            </button>
            <button
                onClick={() => setCurrentSlide(prev => prev === heroSlides.length - 1 ? 0 : prev + 1)}
                className="hero-nav-btn hero-nav-btn--right"
            >
                <ChevronRight className="nav-icon" />
            </button>

            <div className="hero-indicators">
                {heroSlides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`hero-indicator ${currentSlide === index ? "active" : ""}`}
                    />
                ))}
            </div>
        </section>
    );
};

export default HeroSection;