import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

export const orderApi = {
  // Lấy danh sách đơn hàng (admin)
  getOrders: async (params?: { 
    status?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await axios.get(`${BASE_URL}/orders`, { params });
    return response.data;
  },

  // Lấy chi tiết đơn hàng
  getOrderById: async (id: string) => {
    const response = await axios.get(`${BASE_URL}/orders/${id}`);
    return response.data;
  },

  // Lấy đơn hàng của user hiện tại (customer)
  getUserOrders: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await axios.get(`${BASE_URL}/orders/my-orders`, { params });
    return response.data;
  },

  // Cập nhật trạng thái đơn hàng
  updateOrderStatus: async (id: string, data: {
    status: string;
    note?: string;
  }) => {
    const response = await axios.patch(`${BASE_URL}/orders/${id}/status`, data);
    return response.data;
  },

  // Lấy đơn hàng được gán cho shipper
  getAssignedOrders: async () => {
    const response = await axios.get(`${BASE_URL}/orders/assigned`);
    return response.data;
  },

  // Lấy thống kê đơn hàng
  getOrderAnalytics: async (params?: {
    startDate?: string;
    endDate?: string;
  }) => {
    const response = await axios.get(`${BASE_URL}/orders/analytics`, { params });
    return response.data;
  },

  // Đặt hàng (customer)
  createOrder: async (data: {
    items: Array<{
      productId: string;
      quantity: number;
    }>;
    shippingAddress: {
      street: string;
      ward: string;
      district: string;
      city: string;
    };
    phone: string;
    paymentMethod: 'COD' | 'Bank Transfer';
    promoCode?: string;
  }) => {
    const response = await axios.post(`${BASE_URL}/orders`, data);
    return response.data;
  }
};