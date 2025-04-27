import Home from "./pages/customer/home/Home";
import "./App.css";
import ProfilePage from "./components/profile/ProfilePage";
import ProductList from "./components/products/ProductList";
import CustomerLayout from "./layouts/CustomerLayout";
import { CartProvider } from "./contexts/CartContext";
import ProductDetail from "./pages/customer/product-detail/ProductDetail";
import LoginPage from "./pages/login-page";
import Cart from "./pages/customer/cart/Cart";
import Checkout from "./pages/customer/checkout";
import OrderList from "./components/profile/order/OrderList";
import OrderDetailPage from "./components/profile/order/order-detail/OrderDetailPage";

import AdminLayout from "./layouts/AdminLayout";
import AnalyticsPage from "./pages/admin/analytics/AnalyticsPage";
import ProductsPage from "./pages/admin/products/ProductsPage";
import CategoriesPage from "./pages/admin/categories/CategoriesPage";
import PromotionsPage from "./pages/admin/promotions/PromotionsPage";
import StaffPage from "./pages/admin/staff/StaffPage";
import AssignedOrdersList from "./pages/admin/orders/AssignedOrdersList";
import MyAssignedOrders from "./pages/admin/orders/MyAssignedOrders";
import { createContext, useContext, useState } from "react";
import { Route, BrowserRouter as Router, Routes, Navigate, useLocation } from "react-router-dom";
import { UserRole } from "./types/role";
import AdminLoginPage from './pages/admin/auth/AdminLoginPage';

// Create context for user role and auth
// eslint-disable-next-line react-refresh/only-export-components
export const UserRoleContext = createContext<{
  userRole: UserRole | null;
  setUserRole: (role: UserRole | null) => void;
}>({
  userRole: null,
  setUserRole: () => { },
});

const ProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}) => {
  const { userRole } = useContext(UserRoleContext);
  const location = useLocation();

  if (!userRole) {
    // Determine which login page to navigate to based on the current route
    const loginPath = location.pathname.startsWith("/admin")
      ? "/admin/login"
      : "/login";
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function App() {
  const [userRole, setUserRole] = useState<UserRole | null>(() => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      // Get user role from stored data if available
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        return user.role as UserRole;
      }
      return null;
    } catch {
      return null;
    }
  });

  return (
    <CartProvider>
      <UserRoleContext.Provider value={{ userRole, setUserRole }}>
        <Router>
          <Routes>
            {/* Customer Routes */}
            <Route element={<CustomerLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductList />} />
              <Route
                path="/profile/*"
                element={
                  <ProtectedRoute allowedRoles={['Customer', 'Admin', 'Shipper']}>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route path="/products/detail" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/cart/checkout" element={<Checkout />} />
            </Route>

            {/* Protected Admin Routes */}
            <Route path="/admin">
              <Route
                index
                element={
                  <ProtectedRoute allowedRoles={['Admin']}>
                    <Navigate to="/admin/analytics" replace />
                  </ProtectedRoute>
                }
              />
              <Route path="login" element={<AdminLoginPage />} />
              <Route
                element={
                  <ProtectedRoute allowedRoles={['Admin']}>
                    <AdminLayout userRole="Admin" />
                  </ProtectedRoute>
                }
              >
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="categories" element={<CategoriesPage />} />
                <Route path="orders" element={<OrderList role="admin" />} />
                <Route path="orders/:id" element={<OrderDetailPage role="admin" />} />
                <Route path="promotions" element={<PromotionsPage />} />
                <Route path="staff" element={<StaffPage />} />
              </Route>
            </Route>

            {/* Protected Shipper Routes */}
            <Route
              path="/admin/assigned-orders"
              element={
                <ProtectedRoute allowedRoles={['Shipper', 'Admin']}>
                  <AdminLayout userRole="Shipper" />
                </ProtectedRoute>
              }
            >
              <Route index element={<AssignedOrdersList />} />
              <Route path="my-orders" element={<MyAssignedOrders />} />
            </Route>

            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </Router>
      </UserRoleContext.Provider>
    </CartProvider>
  );
}

export default App;
