import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserRole } from "../../../types/role";
import { orderApi } from "../../../services/admin-api/orderApi";
import { Order } from "../../../types/order";
import "./OrderList.css";

type ViewMode = "assigned-orders" | "shipper-orders" | "default";

type Props = {
  role: UserRole;
  viewMode?: ViewMode;
};

const OrderList = ({ role, viewMode }: Props) => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        let data;

        if (role === "Admin") {
          const response = await orderApi.getOrders({ page: 1, limit: 10 });
          data = response.data.orders;
        } else if (role === "Shipper") {
          if (viewMode === "assigned-orders") {
            const response = await orderApi.getAssignedOrders({
              page: 1,
              limit: 10,
            });
            data = response.data.orders;
          } else if (viewMode === "shipper-orders") {
            const response = await orderApi.getShipperOrders({
              page: 1,
              limit: 10,
            });
            data = response.data.orders;
          } else {
            data = [];
          }
        } else if (role === "Customer") {
          const response = await orderApi.getUserOrders({ page: 1, limit: 5 });
          data = response.data.orders;
        }

        setOrders(data);
        setLoading(false);
      } catch (error) {
        setError("Failed to load orders.");
        setLoading(false);
      }
    };

    fetchOrders();
  }, [role, viewMode]);

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const handleClick = (id: string, status: string) => {
    let path = "";

    if (role === "Customer") {
      path = `/profile/orders/${id}`;
    } else if (role === "Admin") {
      path = `/admin/orders/${id}`;
    } else if (role === "Shipper") {
      if (viewMode === "assigned-orders") {
        path = `/admin/assigned-orders/${id}`;
      } else if (viewMode === "shipper-orders") {
        path = `/admin/shipper-orders/${id}`;
      }
    }

    navigate(path, {
      state: { status, viewMode },
    });
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Chờ xác nhận":
        return "status status-pending";
      case "Đã xác nhận":
        return "status status-processing";
      case "Đang giao":
        return "status status-shipping";
      case "Đã giao":
        return "status status-delivered";
      case "Đã hủy":
        return "status status-cancelled";
      default:
        return "status";
    }
  };

  return (
    <div className="order-list">
      <h2 style={{ marginBottom: "25px" }}>Orders List</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="error-message">{error}</div>}
      {orders.length === 0 && !loading && !error ? (
        <div className="no-orders">No orders available.</div>
      ) : (
        currentOrders.map((order) => (
          <div
            key={order._id}
            onClick={() => handleClick(order._id, order.status)}
            className="order-card"
          >
            <div>
              <span style={{ fontWeight: "600", marginLeft: "20px" }}>
                {order._id}
              </span>
              <span>{new Date(order.createdAt).toLocaleString()}</span>
              <span style={{ fontWeight: "600" }}>
                {order.total.toLocaleString()}đ
              </span>
              <span className={getStatusClass(order.status)}>
                {order.status}
              </span>
            </div>
          </div>
        ))
      )}
      <div className="order-pagination">
        <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
          {"<<"}
        </button>
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          {"<"}
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((page) => {
            if (totalPages <= 5) return true;
            if (currentPage <= 3) return page <= 5;
            if (currentPage >= totalPages - 2) return page >= totalPages - 4;
            return Math.abs(page - currentPage) <= 2;
          })
          .map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={currentPage === page ? "active" : ""}
            >
              {page}
            </button>
          ))}

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          {">"}
        </button>
        <button
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
        >
          {">>"}
        </button>
      </div>
    </div>
  );
};

export default OrderList;
