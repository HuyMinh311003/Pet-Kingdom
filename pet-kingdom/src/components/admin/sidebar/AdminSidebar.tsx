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
    window.location.reload();
  };

  return (
    <aside className="admin-sidebar">
      <nav className="sidebar-nav">
        {userRole === "Admin" && (
          <>
            <NavLink to="/admin/analytics" className="nav-item">
              <BarChart3 size={20} />
              <span>Analytics</span>
            </NavLink>

            <NavLink to="/admin/products" className="nav-item">
              <Package2 size={20} />
              <span>Products</span>
            </NavLink>

            <NavLink to="/admin/categories" className="nav-item">
              <LayoutGrid size={20} />
              <span>Categories</span>
            </NavLink>

            <NavLink to="/admin/orders" className="nav-item">
              <ShoppingBag size={20} />
              <span>Orders</span>
            </NavLink>

            <NavLink to="/admin/promotions" className="nav-item">
              <Tag size={20} />
              <span>Promotions</span>
            </NavLink>

            <NavLink to="/admin/staff" className="nav-item">
              <Users size={20} />
              <span>Staff Management</span>
            </NavLink>
          </>
        )}

        {userRole === "Shipper" && (
          <>
            <NavLink to="/admin/assigned-orders" className="nav-item">
              <PackageCheck size={20} />
              <span>Assigned Orders</span>
            </NavLink>

            <NavLink to="/admin/shipper-orders" className="nav-item">
              <Truck size={20} />
              <span>My Orders</span>
            </NavLink>
          </>
        )}
      </nav>
      <div className="logout-button-container">
        <button className="logout-button" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
