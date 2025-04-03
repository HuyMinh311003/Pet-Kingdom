import React from "react";
import { PawPrint as Paw, ShoppingBag } from "lucide-react";
import "./HomeStyle.css";

const IntroductorySection: React.FC = () => {
  return (
    <section id="intro-section" className="intro-section">
      <div className="section-container">
        <div className="intro-grid">
          <div className="intro-item">
            <Paw className="intro-icon" />
            <h3 className="intro-title">Wide Range of Pets</h3>
            <p className="intro-text">
              Find your perfect companion from our carefully selected variety of breeds.
            </p>
          </div>
          <div className="intro-item">
            <ShoppingBag className="intro-icon" />
            <h3 className="intro-title">Care & Accessories</h3>
            <p className="intro-text">
              Everything your pet needs for a happy and healthy life.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroductorySection;