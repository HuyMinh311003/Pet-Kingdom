import React, { useState } from "react";
import "./styles.css";
import loginHeader from "../../../assets/Login-Header.png";
import { authApi } from "../../../services/customer-api/api";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const [showRegister, setShowRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await authApi.login(email, password);
      const { token, user } = res.data.data;
      if (user.role !== "Customer") {
        alert("Tài khoản không phải Customer");
        return;
      }
      // Lưu vào localStorage để dùng sau
      localStorage.setItem("token", token);
      localStorage.setItem("userId", user._id);
      localStorage.setItem("userRole", user.role);
      navigate("/");
    } catch (err: any) {
      alert(err.response?.data?.message || "Login thất bại");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword || !regConfirm) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }
    if (regPassword !== regConfirm) {
      alert('Password và Confirm password không khớp');
      return;
    }
    try {
      const res = await authApi.register(
        regName,
        regEmail,
        regPassword,
        regPhone
      );
      const { token, user } = res.data.data;
      // backend mặc định role = 'Customer'
      localStorage.setItem('token', token);
      localStorage.setItem('userId', user._id);
      localStorage.setItem('userRole', user.role);
      setShowRegister(false);
      // Thông báo & redirect về trang chính
      alert('Đăng ký thành công!');
      navigate('/login');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Đăng ký thất bại');
    }
  };

  return (
    <div className="login-container">
      <img src={loginHeader} alt="" />
      <div className="login-box">
        <h2 className="login-title">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input type="email" placeholder="Enter your email" onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <input type="password" placeholder="Enter your password" onChange={e => setPassword(e.target.value)} required />
          </div>
          <button className="login-button">Login</button>
        </form>
        <div className="register-link">
          <p>Don't have an account?</p>
          <button
            className="register-button"
            onClick={() => setShowRegister(true)}
          >
            Register
          </button>
        </div>
      </div>
      {/* Nền mờ và card đăng ký */}
      {showRegister && (
        <div className="overlay">
          <div className="register-card">
            <h2 style={{ marginBottom: 20 }}>Register</h2>
            <form onSubmit={handleRegister}>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={regName}
                  onChange={e => setRegName(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="email"
                  placeholder="Email"
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="password"
                  placeholder="Password"
                  value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={regConfirm}
                  onChange={e => setRegConfirm(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Phone (optional)"
                  value={regPhone}
                  onChange={e => setRegPhone(e.target.value)}
                />
              </div>
              <button type="submit" className="signup-button">
                Sign up
              </button>
            </form>
            <button
              className="close-button"
              onClick={() => setShowRegister(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
