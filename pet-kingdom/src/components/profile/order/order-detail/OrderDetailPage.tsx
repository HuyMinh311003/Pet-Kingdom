import { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import OrderProgressBar from "./OrderProgressBar";
import OrderStatus from "./OrderStatus";
import OrderInfo from "./OrderInfo";
import OrderProductList from "./OrderProductList";
import "./OrderDetailPage.css";

type Props = {
  role: "admin" | "profile";
};

const OrderDetailPage = ({ role }: Props) => {
  const location = useLocation();
  const statusFromList = location.state?.status || "Chờ xác nhận"; // fallback nếu không có
  const [status, setStatus] = useState(statusFromList);
  const [previousStatus, setPreviousStatus] = useState<string | undefined>();

  const { id } = useParams();

  return (
    <div>
      <h2 style={{ marginBottom: "30px" }}>Đơn hàng: {id}</h2>
      <OrderProgressBar status={status} previousStatus={previousStatus} />
      <div className="order-detail-container">
        <OrderInfo />
        <OrderProductList />
      </div>
      <OrderStatus
        role={role}
        initialStatus={status}
        onStatusChange={(newStatus) => {
          setPreviousStatus(status);
          setStatus(newStatus);
        }}
      />
    </div>
  );
};

export default OrderDetailPage;
