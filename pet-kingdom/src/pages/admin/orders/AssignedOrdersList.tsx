import { useState } from 'react';
import './OrdersPage.css'

interface Order {
  id: string;
  date: string;
  customerName: string;
  address: string;
  total: number;
}

const AssignedOrdersList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  // Mock data - replace with real API call later
  const [orders] = useState<Order[]>([
    {
      id: "00005",
      date: "17/4/2025",
      customerName: "Lê Văn C",
      address: "789 Đường DEF, Quận 3, TP.HCM",
      total: 450000
    },
    {
      id: "00006",
      date: "17/4/2025",
      customerName: "Phạm Thị D",
      address: "321 Đường GHI, Quận 4, TP.HCM",
      total: 680000
    }
  ]);

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const handleAssignOrder = (orderId: string) => {
    // Handle assigning order to current shipper
    console.log('Assigning order:', orderId);
  };

  return (
    <div className="orders-list">
      <h2>Đơn hàng chờ giao</h2>
      
      <div className="orders-table">
        <div className="table-header">
          <span>Mã đơn hàng</span>
          <span>Ngày đặt</span>
          <span>Khách hàng</span>
          <span>Địa chỉ</span>
          <span>Tổng tiền</span>
          <span>Thao tác</span>
        </div>
        
        {currentOrders.map((order) => (
          <div key={order.id} className="table-row">
            <span>{order.id}</span>
            <span>{order.date}</span>
            <span>{order.customerName}</span>
            <span className="address-cell">{order.address}</span>
            <span>{order.total.toLocaleString()}đ</span>
            <span>
              <button 
                className="assign-button"
                onClick={() => handleAssignOrder(order.id)}
              >
                Nhận đơn
              </button>
            </span>
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
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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

export default AssignedOrdersList;