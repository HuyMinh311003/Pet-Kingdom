import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BarChart3, 
  Package2, 
  LayoutGrid, 
  ShoppingBag,
  Tag,
  Users,
  Truck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import './AdminSidebar.css';
import { UserRole } from '../../../types/role';

interface AdminSidebarProps {
  userRole: UserRole;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ userRole }) => {
  const [showSubtab, setShowSubtab] = useState(false);

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <h1>{userRole === 'Admin' ? 'Admin Dashboard' : 'Shipper Dashboard'}</h1>
      </div>
      
      <nav className="sidebar-nav">
        <NavLink 
          to="/admin/analytics" 
          className={`nav-item ${userRole === 'Shipper' ? 'disabled' : ''}`}
          onClick={(e) => userRole === 'Shipper' && e.preventDefault()}
        >
          <BarChart3 size={20} />
          <span>Analytics</span>
        </NavLink>

        <NavLink 
          to="/admin/products" 
          className={`nav-item ${userRole === 'Shipper' ? 'disabled' : ''}`}
          onClick={(e) => userRole === 'Shipper' && e.preventDefault()}
        >
          <Package2 size={20} />
          <span>Products</span>
        </NavLink>
        
        <NavLink 
          to="/admin/categories" 
          className={`nav-item ${userRole === 'Shipper' ? 'disabled' : ''}`}
          onClick={(e) => userRole === 'Shipper' && e.preventDefault()}
        >
          <LayoutGrid size={20} />
          <span>Categories</span>
        </NavLink>

        <NavLink 
          to="/admin/orders" 
          className={`nav-item ${userRole === 'Shipper' ? 'disabled' : ''}`}
          onClick={(e) => userRole === 'Shipper' && e.preventDefault()}
        >
          <ShoppingBag size={20} />
          <span>Orders</span>
        </NavLink>

        <NavLink 
          to="/admin/promotions" 
          className={`nav-item ${userRole === 'Shipper' ? 'disabled' : ''}`}
          onClick={(e) => userRole === 'Shipper' && e.preventDefault()}
        >
          <Tag size={20} />
          <span>Promotions</span>
        </NavLink>

        <NavLink 
          to="/admin/staff" 
          className={`nav-item ${userRole === 'Shipper' ? 'disabled' : ''}`}
          onClick={(e) => userRole === 'Shipper' && e.preventDefault()}
        >
          <Users size={20} />
          <span>Staff Management</span>
        </NavLink>

        <div className="nav-item-with-subtabs">
          <NavLink 
            to="/admin/assigned-orders" 
            className={`nav-item ${userRole === 'Admin' ? 'disabled' : ''}`}
            onClick={(e) => {
              if (userRole === 'Admin') {
                e.preventDefault();
              }
            }}
          >
            <div className="nav-item-content">
              <div className="nav-item-main">
                <Truck size={20} />
                <span>Assigned Orders</span>
              </div>
              {userRole === 'Shipper' && (
                <button 
                  className="subtab-toggle"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowSubtab(!showSubtab);
                  }}
                >
                  {showSubtab ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              )}
            </div>
          </NavLink>

          {userRole === 'Shipper' && showSubtab && (
            <NavLink 
              to="/admin/assigned-orders/my-orders"
              className="nav-subtab"
            >
              <span style={{ marginLeft: '44px' }}>Đơn hàng của tôi</span>
            </NavLink>
          )}
        </div>
      </nav>
    </aside>
  );
};

export default AdminSidebar;