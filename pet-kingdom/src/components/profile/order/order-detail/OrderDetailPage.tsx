import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { UserRole } from "../../../../types/role";
import OrderProgressBar from "./OrderProgressBar";
import OrderStatus from "./OrderStatus";
import OrderInfo from "./OrderInfo";
import OrderProductList from "./OrderProductList";
import { orderApi } from "../../../../services/admin-api/orderApi";
import "./OrderDetailPage.css";
import { Order } from "../../../../types/order";

type ViewMode = "assigned-orders" | "shipper-orders" | "default";

type Props = {
  role: UserRole;
};

const OrderDetailPage = ({ role }: Props) => {
  const { id } = useParams();
  const location = useLocation();

  const statusFromList = location.state?.status || "Chờ xác nhận";
  const viewMode: ViewMode = location.state?.viewMode || "default";

  const [status, setStatus] = useState(statusFromList);
  const [previousStatus, setPreviousStatus] = useState<string | undefined>();

  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const data = await orderApi.getOrderById(id!);
        console.log(data);
        setOrder(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchOrderData();
  }, [id]);

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 style={{ marginBottom: "10px" }}>Đơn hàng: {order?._id}</h2>
      <h3 style={{ marginBottom: "30px" }}>
        Shipper:{" "}
        {order.assignedTo
          ? `${order.assignedTo.name} - ${order.assignedTo._id}`
          : "Chưa có shipper"}
      </h3>
      <OrderProgressBar status={status} previousStatus={previousStatus} />
      <div className="order-detail-container">
        <OrderInfo />
        <OrderProductList />
      </div>
      <OrderStatus
        role={role}
        initialStatus={status}
        viewMode={viewMode}
        onStatusChange={(newStatus) => {
          setPreviousStatus(status);
          setStatus(newStatus);
        }}
        orderId={id || ""}
      />
    </div>
  );
};

export default OrderDetailPage;
