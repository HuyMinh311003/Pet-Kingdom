import Home from "./pages/customer/home/Home";
import "./App.css";
import ProfilePage from "./components/profile/ProfilePage";
import ProductList from "./components/products/ProductList";
import CustomerLayout from "./layouts/CustomerLayout";
import { CartProvider } from "./contexts/CartContext";
import ProductDetail from "./pages/customer/product-detail/ProductDetail";
import LoginPage from "./pages/customer/login-page";
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
import { Route, BrowserRouter as Router, Routes, Navigate } from "react-router-dom";
import AdminLoginPage from './pages/admin/auth/AdminLoginPage';
import { UserRoleProvider } from "./contexts/UserRoleContext";
import ProtectedRoute from "./components/common/ProtectedRoute";



function App() {
  return (
    <CartProvider>
      <UserRoleProvider>
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

            {/* Admin & Shipper Routes */}
            <Route path="/admin">
              <Route index element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <Navigate to="/admin/analytics" replace />
                </ProtectedRoute>
              } />
              <Route path="login" element={<AdminLoginPage />} />
              <Route element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <AdminLayout userRole="Admin" />
                </ProtectedRoute>
              }>
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="categories" element={<CategoriesPage />} />
                <Route path="orders" element={<OrderList role="admin" />} />
                <Route path="orders/:id" element={<OrderDetailPage role="admin" />} />
                <Route path="promotions" element={<PromotionsPage />} />
                <Route path="staff" element={<StaffPage />} />
              </Route>

              <Route path="assigned-orders" element={
                <ProtectedRoute allowedRoles={['Shipper', 'Admin']}>
                  <AdminLayout userRole="Shipper" />
                </ProtectedRoute>
              }>
                <Route index element={<AssignedOrdersList />} />
                <Route path="my-orders" element={<MyAssignedOrders />} />
              </Route>
            </Route>

            {/* Auth */}
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </Router>
      </UserRoleProvider>
    </CartProvider>
  );
}

export default App;
