// src/layouts/CustomerLayout.tsx
import { Outlet } from "react-router-dom";
import Header from "../components/navbar/header/Header";
import { useCart } from "../contexts/CartContext";

const CustomerLayout = () => {
  const { cartItems } = useCart();
  return (
    <>
      <Header cartItems={cartItems} />
      <div className="main-content">
        <Outlet />
      </div>
    </>
  );
};

export default CustomerLayout;
