import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/sidebar/AdminSidebar';
import { UserRole } from '../types/role';
import './AdminLayout.css';

interface Props {
  userRole: UserRole;
}

const AdminLayout: React.FC<Props> = ({ userRole }) => {

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