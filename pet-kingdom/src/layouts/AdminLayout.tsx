import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/sidebar/AdminSidebar";
import { UserRoleContext } from "../contexts/UserRoleContext";
import "./AdminLayout.css";

const AdminLayout: React.FC = () => {
  const { userRole } = useContext(UserRoleContext);

  if (!userRole) return null;

  return (
    <div className="admin-layout">
      <AdminSidebar userRole={userRole} />
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
