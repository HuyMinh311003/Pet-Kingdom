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
            <p className="footer-text">
              Your trusted partner in finding and caring for the perfect pet
              companion.
            </p>
          </div>
          <div>
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li>
                <a href="#" className="footer-link">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Terms of Use
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
            <h4 className="footer-heading">Contact Us</h4>
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
