import { useState, useEffect } from 'react';
import { orderApi } from '../../../services/api/orderApi';
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
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await orderApi.getOrders({ 
          status: 'Đã xác nhận',
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

  const handleAssignOrder = async (orderId: string) => {
    try {
      await orderApi.updateOrderStatus(orderId, {
        status: 'Đang giao',
        note: 'Order assigned to shipper'
      });
      // Refresh orders list
      const response = await orderApi.getOrders({ 
        status: 'Đã xác nhận',
        page: currentPage,
        limit: ordersPerPage
      });
      setOrders(response.data.orders);
    } catch (err) {
      console.error('Error assigning order:', err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

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
        
        {orders.map((order) => (
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

      {orders.length > ordersPerPage && (
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

          {Array.from({ length: Math.ceil(orders.length / ordersPerPage) }, (_, i) => i + 1)
            .filter((page) => {
              if (Math.ceil(orders.length / ordersPerPage) <= 5) return true;
              if (currentPage <= 3) return page <= 5;
              if (currentPage >= Math.ceil(orders.length / ordersPerPage) - 2) return page >= Math.ceil(orders.length / ordersPerPage) - 4;
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
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(orders.length / ordersPerPage)))}
            disabled={currentPage === Math.ceil(orders.length / ordersPerPage)}
          >
            {">"}
          </button>
          <button
            onClick={() => setCurrentPage(Math.ceil(orders.length / ordersPerPage))}
            disabled={currentPage === Math.ceil(orders.length / ordersPerPage)}
          >
            {">>"}
          </button>
        </div>
      )}
    </div>
  );
};

export default AssignedOrdersList;
