import { RouteObject } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import CustomerLayout from '../layouts/CustomerLayout';
import Home from '../pages/customer/home/Home';
import Login from '../pages/customer/auth/Login';
import SignUp from '../pages/customer/auth/SignUp';
import Cart from '../pages/customer/cart/Cart';
import ProductDetail from '../pages/customer/product-detail/ProductDetail';
import Admin from '../pages/admin/admin';
import CategoriesPage from '../pages/admin/categories/CategoriesPage';
import ProductsPage from '../pages/admin/products/ProductsPage';
import OrdersPage from '../pages/admin/orders/OrdersPage';
import StaffPage from '../pages/admin/staff/StaffPage';
import AssignedOrdersPage from '../pages/admin/orders/AssignedOrdersPage';
import AnalyticsPage from '../pages/admin/analytics/AnalyticsPage';
import PromotionsPage from '../pages/admin/promotions/PromotionsPage';
import React from 'react';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <CustomerLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'signup',
        element: <SignUp />,
      },
      {
        path: 'cart',
        element: <Cart />,
      },
      {
        path: 'product/:id',
        element: <ProductDetail />,
      },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout userRole={'admin'} />,
    children: [
      {
        index: true,
        element: <Admin />,
      },
      {
        path: 'categories',
        element: <CategoriesPage />,
      },
      {
        path: 'products/*',
        element: <ProductsPage />,
      },
      {
        path: 'orders',
        element: <OrdersPage />,
      },
      {
        path: 'staff',
        element: <StaffPage />,
      },
      {
        path: 'assigned-orders',
        element: <AssignedOrdersPage />,
      },
      {
        path: 'analytics',
        element: <AnalyticsPage />,
      },
      {
        path: 'promotions',
        element: <PromotionsPage />,
      },
    ],
  },
];