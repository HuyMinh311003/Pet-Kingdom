import api from "./axiosConfig";

export const orderApi = {
  getOrders: async (params?: {
    status?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) => {
    try {
      const response = await api.get("/orders", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  },

  // Lấy chi tiết đơn hàng
  getOrderById: async (id: string) => {
    const response = await api.get(`/orders/${id}`);
    return response.data.data;
  },

  // Lấy đơn hàng của customer
  getUserOrders: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get("/orders/customer-orders", { params });
    return response.data;
  },

  // Cập nhật trạng thái đơn hàng
  updateOrderStatus: async (
    id: string,
    data: {
      status: string;
      note?: string;
    }
  ) => {
    const response = await api.patch(`/orders/${id}/status`, data);
    return response.data;
  },

  // Lấy danh sách đơn hàng "đã xác nhận"
  getAssignedOrders: async (params?: { page?: number; limit?: number }) => {
    const response = await api.get("/orders/assigned-orders", { params });
    return response.data;
  },

  // Lấy đơn hàng đã được shipper chọn
  getShipperOrders: async (params?: { page?: number; limit?: number }) => {
    const response = await api.get("/orders/shipper-orders", { params });
    return response.data;
  },

  // Shipper tự chọn đơn hàng
  assignOrderToShipper: async (id: string) => {
    const response = await api.put(`/orders/assign/${id}`);
    return response.data;
  },

  // Lấy thống kê đơn hàng
  getOrderAnalytics: async (params?: {
    startDate?: string;
    endDate?: string;
  }) => {
    const response = await api.get("/orders/analytics", { params });
    return response.data;
  },
};
