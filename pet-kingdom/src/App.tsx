import {
  Route,
  BrowserRouter as Router,
  Routes,
  Navigate,
} from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import { UserRoleProvider } from "./contexts/UserRoleContext";

import CustomerLayout from "./layouts/CustomerLayout";
import LoginPage from "./pages/customer/login-page";
import Home from "./pages/customer/home/Home";
import ProductList from "./components/products/ProductList";
import ProductDetail from "./pages/customer/product-detail/ProductDetail";
import Cart from "./pages/customer/cart/Cart";
import Checkout from "./pages/customer/checkout";
import ProfilePage from "./components/profile/ProfilePage";
import OrderList from "./components/profile/order/OrderList";
import OrderDetailPage from "./components/profile/order/order-detail/OrderDetailPage";
import AdminLayout from "./layouts/AdminLayout";
import AdminLoginPage from "./pages/admin/auth/AdminLoginPage";
import AnalyticsPage from "./pages/admin/analytics/AnalyticsPage";
import ProductsPage from "./pages/admin/products/ProductsPage";
import CategoriesPage from "./pages/admin/categories/CategoriesPage";
import PromotionsPage from "./pages/admin/promotions/PromotionsPage";
import StaffPage from "./pages/admin/staff/StaffPage";

import ProtectedRoute from "./components/common/ProtectedRoute";
import "./App.css";
import { ToastProvider } from "./contexts/ToastContext";

function App() {
  return (
    <CartProvider>
      <UserRoleProvider>
        <ToastProvider>
          <Router>
            <Routes>
              {/* Customer Routes */}
              <Route element={<CustomerLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<ProductList />} />
                <Route
                  path="/profile/*"
                  element={
                    <ProtectedRoute
                      allowedRoles={["Customer"]}
                    >
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/cart/checkout" element={<Checkout />} />
              </Route>

              {/* Admin & Shipper Routes */}
              <Route path="/admin">
                <Route path="login" element={<AdminLoginPage />} />
                <Route
                  index
                  element={
                    <ProtectedRoute allowedRoles={["Admin"]}>
                      <Navigate to="/admin/analytics" replace />
                    </ProtectedRoute>
                  }
                />

                <Route
                  element={
                    <ProtectedRoute allowedRoles={["Admin", "Shipper"]}>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  {/* Admin */}
                  <Route path="analytics" element={<AnalyticsPage />} />
                  <Route path="products" element={<ProductsPage />} />
                  <Route path="categories" element={<CategoriesPage />} />
                  <Route path="promotions" element={<PromotionsPage />} />
                  <Route path="staff" element={<StaffPage />} />
                  <Route path="orders" element={<OrderList role="Admin" />} />
                  <Route
                    path="orders/:id"
                    element={<OrderDetailPage role="Admin" />}
                  />

                  {/* Shipper */}
                  <Route
                    path="assigned-orders"
                    element={
                      <OrderList role="Shipper" viewMode="assigned-orders" />
                    }
                  />
                  <Route
                    path="assigned-orders/:id"
                    element={<OrderDetailPage role="Shipper" />}
                  />
                  <Route
                    path="shipper-orders"
                    element={
                      <OrderList role="Shipper" viewMode="shipper-orders" />
                    }
                  />
                  <Route
                    path="shipper-orders/:id"
                    element={<OrderDetailPage role="Shipper" />}
                  />
                </Route>
              </Route>

              {/* Auth */}
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </Router>
        </ToastProvider>
      </UserRoleProvider>
    </CartProvider>
  );
}

export default App;
