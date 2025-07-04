// src/pages/profile/ProfilePage.tsx
import { useEffect, useRef, useState } from "react";
import { NavLink, Routes, Route, useNavigate } from "react-router-dom";
import { User, ShoppingBag, Heart, Gift, LogOut, Camera } from "lucide-react";

import PersonalInfo from "./PersonalInfo";
import OrderList from "./order/OrderList";
import OrderDetailPage from "./order/order-detail/OrderDetailPage";
import Wishlist from "./Wishlist";
import { getProfile, uploadAvatar } from "../../services/customer-api/profileApi";
import { User as UserType } from "../../types/user";

import "./ProfilePage.css";

// Default avatar image URL
const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

export default function ProfilePage() {
  const [user, setUser] = useState<UserType | null>(null);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
      .then((res) => {
        console.log("User avatar from getProfile:", res.data.data.avatar); // <-- log avatar ở đây
        setUser(res.data.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await uploadAvatar(formData);
      console.log("Returned avatar path from uploadAvatar:", res.data.data.avatar);
      console.log("Full URL to avatar:", `${import.meta.env.VITE_API_URL}${res.data.data.avatar}`);

      // Gọi lại API profile để cập nhật hình mới
      const userRes = await getProfile(user?._id || "");
      console.log("Updated user avatar after upload:", userRes.data.data.avatar); // <-- log avatar mới sau khi cập nhật

      setUser(userRes.data.data);
    } catch (err) {
      console.error("Upload avatar failed:", err);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="container">
          <div className="user-info">
            <div className="user-avatar">
              <div 
                className="avatar-container"
                onClick={handleAvatarClick}
              >
                <img
                  src={
                    user?.avatar
                      ? `${import.meta.env.VITE_API_URL.replace(/\/+$/, '')}/${user.avatar.replace(/^\/+/, '')}?t=${Date.now()}`
                      : DEFAULT_AVATAR
                  }
                  alt="User Avatar"
                  className="avatar-image"
                />
                <div className="avatar-overlay">
                  <Camera size={32} color="white" />
                </div>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleAvatarChange}
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
            {/* <NavLink to="/profile/promo-codes" className="tab-button">
              <Gift size={20} />
              <span>Mã khuyến mãi</span>
            </NavLink> */}
          </div>
          <button className="profile-logout-button" onClick={handleLogout}>
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
