import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

  const [orders, setOrders] = useState<Order[]>([
    { id: "00001", date: "1/4/2025", total: 250000, status: "Chờ xác nhận" },
    { id: "00002", date: "2/4/2025", total: 340000, status: "Đã xác nhận" },
    { id: "00003", date: "3/4/2025", total: 1290000, status: "Đang giao" },
    { id: "00004", date: "4/4/2025", total: 459000, status: "Đã giao" },
    { id: "00005", date: "5/4/2025", total: 999000, status: "Đã hủy" },
    { id: "00006", date: "6/4/2025", total: 310000, status: "Chờ xác nhận" },
    { id: "00007", date: "6/4/2025", total: 780000, status: "Đã xác nhận" },
    { id: "00008", date: "7/4/2025", total: 1500000, status: "Đang giao" },
    { id: "00009", date: "7/4/2025", total: 600000, status: "Đã giao" },
    { id: "00010", date: "8/4/2025", total: 850000, status: "Đã hủy" },
    { id: "00011", date: "8/4/2025", total: 330000, status: "Chờ xác nhận" },
    { id: "00012", date: "8/4/2025", total: 470000, status: "Đã xác nhận" },
    { id: "00013", date: "9/4/2025", total: 500000, status: "Đang giao" },
    { id: "00014", date: "9/4/2025", total: 1230000, status: "Đã giao" },
    { id: "00015", date: "9/4/2025", total: 760000, status: "Đã hủy" },
    { id: "00016", date: "10/4/2025", total: 470000, status: "Chờ xác nhận" },
    { id: "00017", date: "10/4/2025", total: 970000, status: "Đã xác nhận" },
    { id: "00018", date: "10/4/2025", total: 820000, status: "Đang giao" },
    { id: "00019", date: "11/4/2025", total: 910000, status: "Đã giao" },
    { id: "00020", date: "11/4/2025", total: 560000, status: "Đã hủy" },
    { id: "00021", date: "11/4/2025", total: 470000, status: "Chờ xác nhận" },
    { id: "00022", date: "12/4/2025", total: 970000, status: "Đã xác nhận" },
    { id: "00023", date: "12/4/2025", total: 820000, status: "Đang giao" },
    { id: "00024", date: "12/4/2025", total: 910000, status: "Đã giao" },
    { id: "00025", date: "13/4/2025", total: 560000, status: "Đã hủy" },
    { id: "00026", date: "13/4/2025", total: 470000, status: "Chờ xác nhận" },
    { id: "00027", date: "13/4/2025", total: 970000, status: "Đã xác nhận" },
    { id: "00028", date: "14/4/2025", total: 820000, status: "Đang giao" },
    { id: "00029", date: "14/4/2025", total: 910000, status: "Đã giao" },
    { id: "00030", date: "14/4/2025", total: 560000, status: "Đã hủy" },
    { id: "00031", date: "15/4/2025", total: 470000, status: "Chờ xác nhận" },
    { id: "00032", date: "15/4/2025", total: 970000, status: "Đã xác nhận" },
    { id: "00033", date: "15/4/2025", total: 820000, status: "Đang giao" },
    { id: "00034", date: "16/4/2025", total: 910000, status: "Đã giao" },
    { id: "00035", date: "16/4/2025", total: 560000, status: "Đã hủy" },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

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
    </div>
  );
};

export default OrderList;
