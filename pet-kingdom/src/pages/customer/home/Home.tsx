import { useState } from "react";
import './style.css';
import HeroSection from "../../../components/home/HeroSection";
import IntroductorySection from "../../../components/home/IntroductorySection";
import Footer from "../../../components/common/footer/Footer";
import LeftMenu from "../../../components/navbar/left-menu/LeftMenu";

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&q=80&w=1920",
      title: "Find Your Perfect Companion",
      subtitle: "Discover our wide selection of loving pets"
    },
    {
      image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=1920",
      title: "Premium Pet Care Products",
      subtitle: "Everything your pet needs to thrive"
    }
  ];

  return (
    <div className="app-container">
      <LeftMenu />
      <HeroSection
        heroSlides={heroSlides}
        currentSlide={currentSlide}
        setCurrentSlide={setCurrentSlide}
      />

      {/* Introductory Section */}
      <IntroductorySection />


      <Footer />
    </div>
  );
};

export default Home;
