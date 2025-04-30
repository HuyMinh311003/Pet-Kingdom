import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { orderApi } from "../../../services/admin-api/orderApi";
import "./OrderList.css";

type Order = {
  id: string;
  date: string;
  total: number;
  status: string;
};

type Props = {
  role: "admin" | "profile";
};

const OrderList = ({ role }: Props) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await orderApi.getUserOrders({
          page: currentPage,
          limit: ordersPerPage
        });
        setOrders(response.data.orders);
      } catch (err) {
        setError('Failed to fetch orders');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentPage]);

  const handleClick = (id: string, status: string) => {
    navigate(`/${role}/orders/${id}`, {
      state: { status },
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  return (
    <div className="order-list">
      <h2 style={{ marginBottom: "25px" }}>Orders List</h2>
      {currentOrders.map((order) => (
        <div
          key={order.id}
          onClick={() => handleClick(order.id, order.status)}
          className="order-card"
        >
          <div>
            <span style={{ fontWeight: "600", marginLeft: "20px" }}>
              {order.id}
            </span>
            <span>{order.date}</span>
            <span style={{ fontWeight: "600" }}>
              {order.total.toLocaleString()}đ
            </span>
            <span className={getStatusClass(order.status)}>{order.status}</span>
          </div>
        </div>
      ))}

      {totalPages > 1 && (
        <div className="pagination">
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
      )}
    </div>
  );
};

export default OrderList;
