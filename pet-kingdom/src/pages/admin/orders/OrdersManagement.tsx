import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderApi } from '../../../services/api/orderApi';
import './OrdersPage.css';

interface Order {
  id: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
  shippingAddress: {
    street: string;
    ward: string;
    district: string;
    city: string;
  };
  total: number;
  status: string;
}

const OrdersManagement = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const params: any = {
          page: currentPage,
          limit: ITEMS_PER_PAGE
        };

        if (statusFilter !== 'all') {
          params.status = statusFilter;
        }

        // TODO: Implement search functionality on backend
        const response = await orderApi.getOrders(params);
        setOrders(response.data.orders);
        setTotalPages(Math.ceil(response.data.pagination.total / ITEMS_PER_PAGE));
      } catch (err) {
        setError('Failed to fetch orders');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentPage, statusFilter]);

  const formatAddress = (address: Order['shippingAddress']) => {
    return `${address.street}, ${address.ward}, ${address.district}, ${address.city}`;
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

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1>Orders Management</h1>
        <div className="orders-filters">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-filter"
          >
            <option value="all">All Status</option>
            <option value="Chờ xác nhận">Chờ xác nhận</option>
            <option value="Đã xác nhận">Đã xác nhận</option>
            <option value="Đang giao">Đang giao</option>
            <option value="Đã giao">Đã giao</option>
            <option value="Đã hủy">Đã hủy</option>
          </select>
        </div>
      </div>

      <div className="orders-table">
        <div className="table-header">
          <span>Order ID</span>
          <span>Date</span>
          <span>Customer</span>
          <span>Address</span>
          <span>Total</span>
          <span>Status</span>
          <span>Actions</span>
        </div>
        
        {orders.map((order) => (
          <div key={order.id} className="table-row">
            <span>{order.id}</span>
            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
            <span>{order.user.name}</span>
            <span className="address-cell">{formatAddress(order.shippingAddress)}</span>
            <span>{order.total.toLocaleString()}đ</span>
            <span className={getStatusClass(order.status)}>{order.status}</span>
            <span>
              <button 
                className="view-button"
                onClick={() => navigate(`/admin/orders/${order.id}`)}
              >
                View Details
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

export default OrdersManagement;