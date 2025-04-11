import React, { useState } from "react";
import "./styles.css";
import loginHeader from "../../assets/Login-Header.png";
const LoginPage: React.FC = () => {
    const [showRegister, setShowRegister] = useState(false);

  return (
    <div className="login-container">
        <img src={loginHeader} alt="" />
      <div className="login-box">
        <h2 className="login-title">Login</h2>
        <form>
          <div className="input-group">
            <input type="email" placeholder="Enter your email" />
          </div>
          <div className="input-group">
            <input type="password" placeholder="Enter your password" />
          </div>
          <button className="login-button">Login</button>
        </form>
        <div className="register-link">
          <p>Don't have an account?</p>
          <button className="register-button" onClick={() => setShowRegister(true)}>Register</button>
        </div>
      </div>
      {/* Nền mờ và card đăng ký */}
      {showRegister && (
        <div className="overlay">
          <div className="register-card">
            <h2>Register</h2>
            <form>
              <div className="input-group">
                <input type="email" placeholder="Enter your email" />
              </div>
              <div className="input-group">
                <input type="password" placeholder="Enter your password" />
              </div>
              <div className="input-group">
                <input type="password" placeholder="Confirm your password" />
              </div>
              <button className="google-button">Sign up with Google</button>
            </form>
            <button className="close-button" onClick={() => setShowRegister(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
