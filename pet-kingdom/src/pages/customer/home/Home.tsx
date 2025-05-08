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



  const popularCategories = [
    {
      name: "Husky Dogs",
      image: "https://images.unsplash.com/photo-1605568427561-40dd23c2acea?auto=format&fit=crop&q=80&w=800",
      count: "12 Breeds"
    },
    {
      name: "British Shorthair",
      image: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&q=80&w=800",
      count: "8 Breeds"
    },
    {
      name: "Dog Accessories",
      image: "https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?auto=format&fit=crop&q=80&w=800",
      count: "150+ Items"
    },
    {
      name: "Cat Supplies",
      image: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&q=80&w=800",
      count: "100+ Items"
    },
    {
      name: "Pet Food",
      image: "https://images.unsplash.com/photo-1585846888147-3fe14c130048?auto=format&fit=crop&q=80&w=800",
      count: "50+ Brands"
    },
    {
      name: "Pet Health",
      image: "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&q=80&w=800",
      count: "30+ Services"
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
