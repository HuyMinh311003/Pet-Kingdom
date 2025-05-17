// src/pages/profile/ProfilePage.tsx
import { useEffect, useState } from "react";
import { NavLink, Routes, Route, useNavigate } from "react-router-dom";
import { User, ShoppingBag, Heart, Gift, LogOut } from "lucide-react";

import PersonalInfo from "./PersonalInfo";
import OrderList from "./order/OrderList";
import OrderDetailPage from "./order/order-detail/OrderDetailPage";
import Wishlist from "./Wishlist";
import { getProfile } from "../../services/customer-api/profileApi";
import { User as UserType } from "../../types/user";

import "./ProfilePage.css";

export default function ProfilePage() {
  const [user, setUser] = useState<UserType | null>(null);
  const navigate = useNavigate();

  // Hàm xử lý Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user._id;

    if (!userId) return;

    getProfile(userId)
      .then((res) => setUser(res.data.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="container">
          <div className="user-info">
            <div className="user-avatar">
              <img
                src={
                  user?.avatar ||
                  "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=120"
                }
                alt="User Avatar"
              />
            </div>
            <div className="user-details">
              <h1>{user?.name || "Loading..."}</h1>
              <p>{user?.email || ""}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-content container">
        <div className="sidebar-container">
          <div className="tabs-navigation">
            <NavLink to="/profile" end className="tab-button">
              <User size={20} />
              <span>Thông tin cá nhân</span>
            </NavLink>
            <NavLink to="/profile/orders" className="tab-button">
              <ShoppingBag size={20} />
              <span>Đơn hàng</span>
            </NavLink>
            <NavLink to="/profile/wishlist" className="tab-button">
              <Heart size={20} />
              <span>Danh sách yêu thích</span>
            </NavLink>
            <NavLink to="/profile/promo-codes" className="tab-button">
              <Gift size={20} />
              <span>Mã khuyến mãi</span>
            </NavLink>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Đăng xuất</span>
          </button>
        </div>

        <div className="tab-container">
          <Routes>
            <Route index element={<PersonalInfo />} />
            <Route path="orders" element={<OrderList role="Customer" />} />
            <Route
              path="orders/:id"
              element={<OrderDetailPage role="Customer" />}
            />
            <Route path="wishlist" element={<Wishlist />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
