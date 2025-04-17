import { useState } from 'react';

interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  address: string;
  customerName: string;
  phone: string;
}

const MyOrdersList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  // Mock data - replace with real API call later
  const [orders] = useState<Order[]>([
    {
      id: "00003",
      date: "17/4/2025",
      total: 450000,
      status: "Đang giao",
      address: "789 Trần Văn C, Quận 3, TP.HCM",
      customerName: "Nguyễn Văn A",
      phone: "0123456789"
    },
    {
      id: "00004",
      date: "17/4/2025",
      total: 550000,
      status: "Đang giao",
      address: "321 Phạm Văn D, Quận 4, TP.HCM",
      customerName: "Trần Thị B",
      phone: "0987654321"
    }
  ]);

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const handleUpdateStatus = (orderId: string, status: string) => {
    // Handle updating order status
    console.log('Updating order:', orderId, 'to status:', status);
  };

  return (
    <div className="orders-list">
      <h2>Đơn hàng của tôi</h2>
      
      <div className="orders-table">
        <div className="table-header">
          <span>Mã đơn hàng</span>
          <span>Khách hàng</span>
          <span>Số điện thoại</span>
          <span>Địa chỉ</span>
          <span>Tổng tiền</span>
          <span>Trạng thái</span>
        </div>
        
        {currentOrders.map((order) => (
          <div key={order.id} className="table-row">
            <span>{order.id}</span>
            <span>{order.customerName}</span>
            <span>{order.phone}</span>
            <span className="address-cell">{order.address}</span>
            <span>{order.total.toLocaleString()}đ</span>
            <span>
              <select 
                value={order.status}
                onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                className="status-select"
              >
                <option value="Đang giao">Đang giao</option>
                <option value="Đã giao">Đã giao</option>
                <option value="Không thành công">Không thành công</option>
              </select>
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

export default MyOrdersList;