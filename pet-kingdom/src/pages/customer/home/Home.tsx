import { useState } from "react";
import './style.css';
import NavBar from "../../../components/navbar/NavBar";
import HeroSection from "../../../components/home/HeroSection";
import IntroductorySection from "../../../components/home/IntroductorySection";
import DogBreedSlider from "../../../components/home/DogBreedSlider";
import PetCareAccessoriesSection from "../../../components/home/PetCare&AccessoriesSection";
import OnSaleSection from "../../../components/home/OnSaleSection";
import PopularCategoriesSection from "../../../components/home/PopularCategoriesSection";
import Footer from "../../../components/common/footer/Footer";

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

  const dogBreeds = [
    {
      name: "Golden Retriever",
      image: "https://images.unsplash.com/photo-1633722715463-d30f4f325e24?auto=format&fit=crop&q=80&w=800",
      description: "Friendly and intelligent family companion"
    },
    {
      name: "Husky",
      image: "https://images.unsplash.com/photo-1605568427561-40dd23c2acea?auto=format&fit=crop&q=80&w=800",
      description: "Energetic and adventurous snow dog"
    },
    {
      name: "French Bulldog",
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=800",
      description: "Charming and compact city companion"
    }
  ];

  const petCareProducts = [
    {
      name: "Premium Dog Bed",
      image: "https://images.unsplash.com/photo-1591946614720-90a587da4a36?auto=format&fit=crop&q=80&w=800",
      price: 59.99,
      id: 1
    },
    {
      name: "Interactive Cat Toy",
      image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=800",
      price: 24.99,
      id: 2
    },
    {
      name: "Deluxe Pet Carrier",
      image: "https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?auto=format&fit=crop&q=80&w=800",
      price: 89.99,
      id: 3
    },
    {
      name: "Natural Pet Shampoo",
      image: "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=800",
      price: 19.99,
      id: 4
    }
  ];

  const saleProducts = [
    {
      name: "Luxury Pet Bed",
      image: "https://images.unsplash.com/photo-1567677776771-522f046ae2d9?auto=format&fit=crop&q=80&w=800",
      originalPrice: 129.99,
      salePrice: 89.99,
      id: 1
    },
    {
      name: "Automatic Pet Feeder",
      image: "https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?auto=format&fit=crop&q=80&w=800",
      originalPrice: 79.99,
      salePrice: 59.99,
      id: 2
    },
    {
      name: "Premium Cat Tree",
      image: "https://images.unsplash.com/photo-1615789591457-74a63395c990?auto=format&fit=crop&q=80&w=800",
      originalPrice: 199.99,
      salePrice: 149.99,
      id: 3
    },
    {
      name: "Dog Training Kit",
      image: "https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?auto=format&fit=crop&q=80&w=800",
      originalPrice: 89.99,
      salePrice: 69.99,
      id: 4
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
      <NavBar />
      {/* Hero Section */}
      <HeroSection
        heroSlides={heroSlides}
        currentSlide={currentSlide}
        setCurrentSlide={setCurrentSlide}
      />

      {/* Introductory Section */}
      <IntroductorySection />

      {/* Dog Breed Slider */}
      <DogBreedSlider dogBreeds={dogBreeds} />

      {/* Pet Care & Accessories Section */}
      <PetCareAccessoriesSection petCareProducts={petCareProducts} />

      {/* On Sale Section */}
      <OnSaleSection
        saleProducts={saleProducts}
      />

      {/* Popular Categories */}
      <PopularCategoriesSection categories={popularCategories} />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
