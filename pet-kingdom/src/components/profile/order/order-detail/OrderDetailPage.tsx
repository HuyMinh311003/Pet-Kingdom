import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { UserRole } from "../../../../types/role";
import { Order } from "../../../../types/order";
import { User } from "../../../../types/user";
import { orderApi } from "../../../../services/admin-api/orderApi";
import { staffApi } from "../../../../services/admin-api/staffApi";
import OrderProgressBar from "./OrderProgressBar";
import OrderStatus from "./OrderStatus";
import OrderInfo from "./OrderInfo";
import OrderProductList from "./OrderProductList";
import "./OrderDetailPage.css";

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
  const [shippers, setShippers] = useState<User[]>([]);
  const [selectedShipper, setSelectedShipper] = useState<string>("");
  const [isAssigning, setIsAssigning] = useState(false);

  const fetchOrderData = async () => {
    try {
      const data = await orderApi.getOrderById(id!);
      setOrder(data);
      // Update status from the fetched order
      if (data.status) {
        setStatus(data.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchOrderData();
  }, [id]);

  useEffect(() => {
    const fetchShippers = async () => {
      try {
        const data = await staffApi.getStaffList();
        setShippers(data);
      } catch (error) {
        console.error("Error fetching shippers:", error);
      }
    };
    if (role === "Admin") {
      fetchShippers();
    }
  }, [role]);

  const handleAssignShipper = async () => {
    if (!selectedShipper) return;

    try {
      setIsAssigning(true);
      const response = await orderApi.adminAssignShipper(id!, selectedShipper);
      setOrder(response.data);
      setSelectedShipper("");
    } catch (error) {
      console.error("Error assigning shipper:", error);
    } finally {
      setIsAssigning(false);
    }
  };

  if (!order) {
    return <div>Loading...</div>;
  }

  const getShipperInfo = () => {
    if (!order.assignedTo) return "Chưa có shipper";
    if (typeof order.assignedTo === "string")
      return `Shipper ID: ${order.assignedTo}`;
    return `${order.assignedTo.name} - ${order.assignedTo._id}`;
  };

  return (
    <div>
      <h2 style={{ marginBottom: "10px" }}>Đơn hàng: {order._id}</h2>
      <div className="order-shipper-container">
        <h3>Shipper: {getShipperInfo()}</h3>
        {role === "Admin" &&
          !order.assignedTo &&
          order.status === "Đã xác nhận" && (
            <div className="assign-shipper-section">
              <select
                className="order-shipper-select"
                value={selectedShipper}
                onChange={(e) => setSelectedShipper(e.target.value)}
              >
                <option value="">Chọn shipper</option>
                {shippers.map((shipper) => (
                  <option key={shipper._id} value={shipper._id}>
                    {shipper.name}
                  </option>
                ))}
              </select>
              <button
                className="order-shipper-button"
                onClick={handleAssignShipper}
                disabled={!selectedShipper || isAssigning}
              >
                {isAssigning ? "Đang gán..." : "Gán shipper"}
              </button>
            </div>
          )}
      </div>

      <OrderProgressBar
        status={status}
        previousStatus={previousStatus}
        statusHistory={order.statusHistory}
      />
      <div className="order-detail-container">
        <OrderInfo order={order} />
        <OrderProductList order={order} />
      </div>
      <OrderStatus
        role={role}
        initialStatus={status}
        viewMode={viewMode}
        onStatusChange={(newStatus) => {
          setPreviousStatus(status);
          setStatus(newStatus);
          // Reload order data when status changes
          fetchOrderData();
        }}
        orderId={id || ""}
        statusHistory={order.statusHistory}
      />
    </div>
  );
};

export default OrderDetailPage;
