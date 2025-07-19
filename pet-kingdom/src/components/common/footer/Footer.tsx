import React from "react";
import { PawPrint as Paw } from "lucide-react";
import "./FooterStyle.css";

const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div>
            <div className="footer-logo">
              <Paw className="logo-icon" />
              <span className="footer-logo-title">PetKingdom</span>
            </div>
            <p className="footer-text" style={{ marginTop: "15px" }}>
              Đối tác tin cậy của bạn trong việc tìm kiếm và chăm sóc người bạn đồng hành hoàn hảo.
            </p>
          </div>
          <div>
            <h4 className="footer-heading">Liên kết</h4>
            <ul className="footer-links">
              <li>
                <a href="#" className="footer-link">
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Điều khoản sử dụng
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="footer-heading">Liên hệ với chúng tôi</h4>
            <ul className="footer-links">
              <li className="footer-text">Email: info@petkingdom.com</li>
              <li className="footer-text">Phone: (555) 123-4567</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
