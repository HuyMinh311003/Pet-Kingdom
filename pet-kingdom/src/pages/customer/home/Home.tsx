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
      title: "Tìm bạn đồng hành lí tưởng dành cho bạn",
      subtitle: "Khám phá thế giới thú cưng đa dạng và đáng yêu của chúng tôi"
    },
    {
      image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=1920",
      title: "Sản phẩm chất lượng cho thú cưng của bạn",
      subtitle: "Mọi thứ thú cưng của bạn cần để phát triển toàn diện"
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
