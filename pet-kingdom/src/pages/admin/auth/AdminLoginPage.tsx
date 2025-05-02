import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { UserRoleContext } from "../../../contexts/UserRoleContext";
import "./AdminLoginPage.css";

const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUserRole } = useContext(UserRoleContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        {
          email,
          password,
        }
      );

      const { user, token } = response.data.data;

      // Chỉ cho phép Admin và Shipper đăng nhập
      if (user.role !== "Admin" && user.role !== "Shipper") {
        setError("Access denied. Admin/Shipper only.");
        return;
      }

      // Lưu thông tin đăng nhập
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUserRole(user.role);

      // Redirect to appropriate dashboard
      if (user.role === "Admin") {
        navigate("/admin/analytics", { replace: true });
      } else if (user.role === "Shipper") {
        navigate("/admin/assigned-orders", { replace: true });
      }
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <h2 className="admin-login-title">Admin Login</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="admin-login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
