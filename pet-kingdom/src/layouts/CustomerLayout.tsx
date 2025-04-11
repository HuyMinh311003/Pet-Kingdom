// src/layouts/CustomerLayout.tsx
import { Outlet } from 'react-router-dom';
import Header from '../components/navbar/header/Header';
import { useCart } from '../contexts/CartContext';
import Breadcrumb from '../components/common/breadcrumb/breadcrumb'; 
const CustomerLayout = () => {
    const { cartItems } = useCart();
    return (
        <>
            <Header cartItems={cartItems} />
            <div className="main-content">
            <Breadcrumb /> 

                <Outlet />
            </div>
        </>
    );
};

export default CustomerLayout;
