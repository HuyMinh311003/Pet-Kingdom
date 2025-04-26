import { useState } from 'react';
import './OrdersPage.css'
interface Order {
  id: string;
  date: string;
  customerName: string;
  address: string;
  total: number;
  status: string;
}

const MyAssignedOrders = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  // Mock data - replace with real API call later
  const [orders] = useState<Order[]>([
    {
      id: "00001",
      date: "17/4/2025",
      customerName: "Nguyễn Văn A",
      address: "123 Đường ABC, Quận 1, TP.HCM",
      total: 250000,
      status: "Đang giao",
    },
    {
      id: "00002",
      date: "16/4/2025",
      customerName: "Trần Thị B",
      address: "456 Đường XYZ, Quận 2, TP.HCM",
      total: 340000,
      status: "Đã giao",
    },
  ]);

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Đang giao":
        return "status status-shipping";
      case "Đã giao":
        return "status status-delivered";
      default:
        return "status";
    }
  };

  return (
    <div className="orders-list">
      <h2>Đơn hàng của tôi</h2>

      <div className="orders-table">
        <div className="table-header">
          <span>Mã đơn hàng</span>
          <span>Ngày nhận</span>
          <span>Khách hàng</span>
          <span>Địa chỉ</span>
          <span>Tổng tiền</span>
          <span>Trạng thái</span>
        </div>

        {currentOrders.map((order) => (
          <div key={order.id} className="table-row">
            <span>{order.id}</span>
            <span>{order.date}</span>
            <span>{order.customerName}</span>
            <span className="address-cell">{order.address}</span>
            <span>{order.total.toLocaleString()}đ</span>
            <span className={getStatusClass(order.status)}>{order.status}</span>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
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

export default MyAssignedOrders;
