import { Routes, Route } from 'react-router-dom';
import OrdersManagement from './OrdersManagement';
import AssignedOrdersList from './AssignedOrdersList';
import OrderDetailPage from '../../../components/profile/order/order-detail/OrderDetailPage';

const OrdersPage = () => {
  return (
    <Routes>
      <Route index element={<OrdersManagement />} />
      <Route path="assigned" element={<AssignedOrdersList />} />
      <Route path=":id" element={<OrderDetailPage role="admin" />} />
    </Routes>
  );
};

export default OrdersPage;