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
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [ordersPerPage, setOrdersPerPage] = useState<number>(10);
  const [statusFilter, setStatusFilter] = useState<string | undefined>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    if (role === "Customer") {
      setOrdersPerPage(5);
    } else {
      setOrdersPerPage(10);
    }
  }, [role]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        let data;
        let total;

        // Construct query parameters
        const queryParams = {
          page: currentPage,
          limit: ordersPerPage,
          status: statusFilter,
          sort: sortOrder === "asc" ? "asc" : "desc", // Handle sorting by createdAt
        };

        // Fetch orders based on role
        if (role === "Admin") {
          const response = await orderApi.getOrders(queryParams);
          data = response.data.orders;
          total = response.data.pagination.pages;
        } else if (role === "Shipper") {
          if (viewMode === "assigned-orders") {
            const response = await orderApi.getAssignedOrders(queryParams);
            data = response.data.orders;
            total = response.data.pagination.pages;
          } else if (viewMode === "shipper-orders") {
            const response = await orderApi.getShipperOrders(queryParams);
            data = response.data.orders;
            total = response.data.pagination.pages;
          }
        } else if (role === "Customer") {
          const response = await orderApi.getUserOrders(queryParams);
          data = response.data.orders;
          total = response.data.pagination.pages;
        }

        setOrders(data);
        setTotalPages(total);
        setLoading(false);
      } catch (error) {
        setError("Failed to load orders.");
        setLoading(false);
      }
    };

    fetchOrders();
  }, [role, viewMode, currentPage, ordersPerPage, statusFilter, sortOrder]); // Add statusFilter and sortOrder to dependencies

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

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(event.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleSortOrderChange = (order: "asc" | "desc") => {
    setSortOrder(order);
    setCurrentPage(1);
  };

  return (
    <div className="order-list">
      <div className="order-header">
        <h2 style={{ marginBottom: "25px" }}>Danh sách đơn hàng</h2>
        <div className="order-filters">
          {viewMode !== "assigned-orders" && (
            <select onChange={handleStatusChange} value={statusFilter}>
              <option value="">Tất cả</option>
              <option value="Chờ xác nhận">Chờ xác nhận</option>
              <option value="Đã xác nhận">Đã xác nhận</option>
              <option value="Đang giao">Đang giao</option>
              <option value="Đã giao">Đã giao</option>
              <option value="Đã hủy">Đã hủy</option>
            </select>
          )}

          <button onClick={() => handleSortOrderChange("asc")}>↑ Date</button>
          <button onClick={() => handleSortOrderChange("desc")}>↓ Date</button>
        </div>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="error-message">{error}</div>}
      {orders.length === 0 && !loading && !error ? (
        <div className="no-orders">Hiện không có đơn hàng</div>
      ) : (
        orders.map((order) => (
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

      {/* Pagination */}
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
