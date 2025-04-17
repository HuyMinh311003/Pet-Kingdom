import { Routes, Route } from 'react-router-dom';
import AssignedOrdersList from './AssignedOrdersList';
import MyAssignedOrders from './MyAssignedOrders';

const OrdersPage = () => {
  return (
    <div className="orders-container">
      <Routes>
        <Route index element={<AssignedOrdersList />} />
        <Route path="my-orders" element={<MyAssignedOrders />} />
      </Routes>
    </div>
  );
};

export default OrdersPage;