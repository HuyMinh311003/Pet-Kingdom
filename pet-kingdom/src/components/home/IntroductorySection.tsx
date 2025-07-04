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
            <h3 className="intro-title">Đa dạng các loài thú cưng</h3>
            <p className="intro-text">
              Tìm người bạn đồng hành lí tưởng trong bộ sưu tập giống thú của chúng tôi.
            </p>
          </div>
          <div className="intro-item">
            <ShoppingBag className="intro-icon" />
            <h3 className="intro-title">Chăm Sóc & Phụ Kiện</h3>
            <p className="intro-text">
              Tất cả những gì thú cưng của bạn cần để sống vui vẻ và khỏe mạnh.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroductorySection;