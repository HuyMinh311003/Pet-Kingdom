import React from "react";
import { NavLink } from "react-router-dom";
import {
  BarChart3,
  Package2,
  LayoutGrid,
  ShoppingBag,
  Tag,
  Users,
  PackageCheck,
  Truck,
  LogOut,
  SettingsIcon,
} from "lucide-react";
import "./AdminSidebar.css";
import { UserRole } from "../../../types/role";

interface AdminSidebarProps {
  userRole: UserRole;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ userRole }) => {
  // Hàm xử lý Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <aside className="admin-sidebar">
      <nav className="sidebar-nav">
        {userRole === "Admin" && (
          <>
            <NavLink to="/admin/analytics" className="nav-item">
              <BarChart3 size={20} />
              <span>Thống kê</span>
            </NavLink>

            <NavLink to="/admin/products" className="nav-item">
              <Package2 size={20} />
              <span>Sản phẩm</span>
            </NavLink>

            <NavLink to="/admin/categories" className="nav-item">
              <LayoutGrid size={20} />
              <span>Danh mục</span>
            </NavLink>

            <NavLink to="/admin/orders" className="nav-item">
              <ShoppingBag size={20} />
              <span>Đơn hàng</span>
            </NavLink>

            {/* <NavLink to="/admin/promotions" className="nav-item">
              <Tag size={20} />
              <span>Promotions</span>
            </NavLink> */}

            <NavLink to="/admin/staff" className="nav-item">
              <Users size={20} />
              <span>Quản lí nhân viên</span>
            </NavLink>

            <NavLink to="/admin/config" className="nav-item">
              <SettingsIcon size={20} />
              <span>Thiết lập</span>
            </NavLink>
          </>
        )}

        {userRole === "Shipper" && (
          <>
            <NavLink to="/admin/assigned-orders" className="nav-item">
              <PackageCheck size={20} />
              <span>Đơn hàng đã xác nhận</span>
            </NavLink>

            <NavLink to="/admin/shipper-orders" className="nav-item">
              <Truck size={20} />
              <span>Đơn hàng của tôi</span>
            </NavLink>
          </>
        )}
      </nav>
      <div className="logout-button-container">
        <button className="logout-button" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
