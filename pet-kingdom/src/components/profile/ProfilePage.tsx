// src/pages/profile/ProfilePage.tsx
import { NavLink, Routes, Route } from 'react-router-dom';
import { User, ShoppingBag, Heart, Gift} from 'lucide-react';

import PersonalInfo from './PersonalInfo';
// import MyOrders from './MyOrders';
// import Wishlist from './Wishlist';
// import PromoCodes from './PromoCodes';
import './ProfilePage.css';

export default function ProfilePage() {
  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-header">
        <div className="container">
          <div className="user-info">
            <div className="user-avatar">
              <img
                src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=120"
                alt="User Avatar"
              />
            </div>
            <div className="user-details">
              <h1>Nguyễn Đăng Khoa</h1>
              <p>khoa.nd@example.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content: cột trái (tabs) & cột phải (nội dung) */}
      <div className="profile-content container">
        <div className="tabs-navigation">
          {/* Khi sử dụng NavLink, khi route khớp nó sẽ tự thêm class "active" */}
          <NavLink
            to="/profile"
            end
            className="tab-button"
          >
            <User size={20} />
            <span>Personal Information</span>
          </NavLink>
          <NavLink
            to="/profile/orders"
            className="tab-button"
          >
            <ShoppingBag size={20} />
            <span>My Orders</span>
          </NavLink>

          <NavLink
            to="/profile/wishlist"
            className="tab-button"
          >
            <Heart size={20} />
            <span>Wishlist</span>
          </NavLink>
          <NavLink
            to="/profile/promo-codes"
            className="tab-button"
          >
            <Gift size={20} />
            <span>My Promo-codes</span>
          </NavLink>
          
          
        </div>

        <div className="tab-container">
          <Routes>
            {/* Khi vào /profile, hiển thị tab PersonalInfo */}
            <Route index element={<PersonalInfo />} />
            {/* <Route path="orders" element={<MyOrders />} /> */}
            {/* <Route path="wishlist" element={<Wishlist />} /> */}
            {/* <Route path="promo-codes" element={<PromoCodes />} /> */}
          </Routes>
        </div>
      </div>
    </div>
  );
}
