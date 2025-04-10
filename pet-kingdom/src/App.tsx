import Home from "./pages/customer/home/Home";
import "./App.css";
import ProfilePage from "./components/profile/ProfilePage";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ProductList from "./components/products/ProductList";
import CustomerLayout from "./layouts/CustomerLayout";
import { CartProvider } from "./contexts/CartContext";
import ProductDetail from "./pages/customer/product-detail/ProductDetail";
import LoginPage from "./pages/login-page";
import Cart from "./pages/customer/cart/Cart";

import OrderList from "./components/profile/order/OrderList";
import OrderDetailPage from "./components/profile/order/order-detail/OrderDetailPage";

import AdminPage from "./pages/admin/admin";

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route element={<CustomerLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/profile/*" element={<ProfilePage />} />
            <Route path="/products/detail" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
          </Route>
        </Routes>
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/orders" element={<OrderList role="admin" />} />
          <Route
            path="/admin/orders/:id"
            element={<OrderDetailPage role="admin" />}
          />
        </Routes>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
