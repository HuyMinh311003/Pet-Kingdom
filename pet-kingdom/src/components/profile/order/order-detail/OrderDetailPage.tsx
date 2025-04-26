import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import OrderProgressBar from "./OrderProgressBar";
import OrderStatus from "./OrderStatus";
import OrderInfo from "./OrderInfo";
import OrderProductList from "./OrderProductList";
import { orderApi } from "../../../../services/api/orderApi";
import "./OrderDetailPage.css";

interface OrderDetail {
  id: string;
  status: string;
  statusHistory: Array<{
    status: string;
    date: string;
    note?: string;
  }>;
  items: Array<{
    product: {
      id: string;
      name: string;
      imageUrl: string;
    };
    quantity: number;
    price: number;
  }>;
  shippingAddress: {
    street: string;
    ward: string;
    district: string;
    city: string;
  };
  phone: string;
  paymentMethod: string;
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  user: {
    name: string;
    email: string;
  };
}

type Props = {
  role: "admin" | "profile";
};

const OrderDetailPage = ({ role }: Props) => {
  const location = useLocation();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orderData, setOrderData] = useState<OrderDetail | null>(null);
  const [status, setStatus] = useState(location.state?.status || "Chờ xác nhận");
  const [previousStatus, setPreviousStatus] = useState<string | undefined>();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await orderApi.getOrderById(id!);
        setOrderData(response.data);
        setStatus(response.data.status);
      } catch (err) {
        setError('Failed to fetch order details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    try {
      await orderApi.updateOrderStatus(id!, {
        status: newStatus,
      });
      setPreviousStatus(status);
      setStatus(newStatus);
      
      // Refresh order data
      const response = await orderApi.getOrderById(id!);
      setOrderData(response.data);
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!orderData) return <div>Order not found</div>;

  return (
    <div>
      <h2 style={{ marginBottom: "30px" }}>Đơn hàng: {id}</h2>
      <OrderProgressBar status={status} previousStatus={previousStatus} />
      <div className="order-detail-container">
        <OrderInfo 
          orderData={orderData}
        />
        <OrderProductList 
          items={orderData.items}
        />
      </div>
      <OrderStatus
        role={role}
        initialStatus={status}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default OrderDetailPage;
