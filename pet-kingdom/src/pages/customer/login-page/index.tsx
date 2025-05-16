import React, { useContext, useState } from "react";
import "./styles.css";
import loginHeader from "../../../assets/Login-Header.png";
import { authApi } from "../../../services/customer-api/api";
import { useNavigate } from "react-router-dom";
import { UserRoleContext } from "../../../contexts/UserRoleContext";
import { useToast } from "../../../contexts/ToastContext";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{10}$/;

const LoginPage: React.FC = () => {
  const [showRegister, setShowRegister] = useState(false);

  // Login fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUserRole } = useContext(UserRoleContext);

  // Register fields
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [regPhone, setRegPhone] = useState("");

  const { showToast } = useToast();

  const navigate = useNavigate();

  // --- LOGIN ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 1) Validate
    if (!email.trim()) {
      showToast("Email không được để trống");
      return;
    }
    if (!emailRegex.test(email)) {
      showToast("Email không hợp lệ");
      return;
    }
    if (password.length < 6) {
      showToast("Password phải ít nhất 6 ký tự");
      return;
    }

    // 2) Call API
    try {
      const res = await authApi.login(email, password);
      const { token, user } = res.data.data;
      if (user.role !== "Customer") {
        showToast("Tài khoản không phải Customer");
        return;
      }
      localStorage.clear();
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUserRole(user.role);
      showToast("Đăng nhập thành công!", "success");
      navigate("/products");
    } catch (err: any) {
      showToast(err.response?.data?.message || "Login thất bại");
    }
  };

  // --- REGISTER ---
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    // 1) Validate từng field
    if (!regName.trim()) {
      showToast("Full Name không được để trống");
      return;
    }
    if (!regEmail.trim()) {
      showToast("Email không được để trống");
      return;
    }
    if (!emailRegex.test(regEmail)) {
      showToast("Email đăng ký không hợp lệ");
      return;
    }
    if (regPassword.length < 6) {
      showToast("Password phải tối thiểu 6 ký tự");
      return;
    }
    if (regPassword !== regConfirm) {
      showToast("Password và Confirm Password không khớp");
      return;
    }
    if (!phoneRegex.test(regPhone)) {
      showToast("Phone phải đúng 10 chữ số");
      return;
    }

    // 2) Call API
    try {
      const res = await authApi.register(
        regName,
        regEmail,
        regPassword,
        regPhone
      );
      const { token, user } = res.data.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userId", user._id);
      localStorage.setItem("userRole", user.role);
      setShowRegister(false);
      showToast("Đăng ký thành công!", "success");
      navigate("/login");
    } catch (err: any) {
      showToast(err.response?.data?.message || "Đăng ký thất bại");
    }
  };

  return (
    <div className="login-container">
      <img src={loginHeader} alt="" />

      {/* --- LOGIN FORM --- */}
      <div className="login-box">
        <h2 className="login-title">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Enter your email"
              onChange={e => setEmail(e.target.value)}
              value={email}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Enter your password"
              onChange={e => setPassword(e.target.value)}
              value={password}
              required
            />
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

      {/* --- REGISTER MODAL --- */}
      {showRegister && (
        <div className="overlay">
          <div className="register-card">
            <h2 style={{ marginBottom: 20 }}>Register</h2>
            <form onSubmit={handleRegister}>
              {/* Full Name */}
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={regName}
                  onChange={e => setRegName(e.target.value)}
                  required
                />
              </div>
              {/* Email */}
              <div className="input-group">
                <input
                  type="email"
                  placeholder="Email"
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                  required
                />
              </div>
              {/* Password */}
              <div className="input-group">
                <input
                  type="password"
                  placeholder="Password"
                  value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                  required
                />
              </div>
              {/* Confirm */}
              <div className="input-group">
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={regConfirm}
                  onChange={e => setRegConfirm(e.target.value)}
                  required
                />
              </div>
              {/* Phone */}
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Phone (10 digits)"
                  value={regPhone}
                  onChange={e => setRegPhone(e.target.value)}
                  required
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
