import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const  api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Products API
export const productsApi = {
  getProducts: () => api.get('/products'),
  getProduct: (id: string) => api.get(`/products/${id}`),
  createProduct: (data: any) => api.post('/products', data),
  updateProduct: (id: string, data: any) => api.put(`/products/${id}`, data),
  deleteProduct: (id: string) => api.delete(`/products/${id}`),
  toggleStatus: (id: string) => api.patch(`/products/${id}/toggle-status`),
  updateStock: (id: string, quantity: number) => api.patch(`/products/${id}/stock`, { quantity })
};

// Categories API
export const categoriesApi = {
  getCategories: (includeInactive = false) => api.get(`/categories?includeInactive=${includeInactive}`),
  getCategory: (id: string) => api.get(`/categories/${id}`),
  createCategory: (data: any) => api.post('/categories', data),
  updateCategory: (id: string, data: any) => api.put(`/categories/${id}`, data),
  deleteCategory: (id: string) => api.delete(`/categories/${id}`),
  toggleStatus: (id: string) => api.patch(`/categories/${id}/toggle-status`)
};

// Orders API  
export const ordersApi = {
  getOrders: () => api.get('/orders'),
  getOrder: (id: string) => api.get(`/orders/${id}`),
  updateOrderStatus: (id: string, status: string, note?: string) => 
    api.patch(`/orders/${id}/status`, { status, note }),
  getOrderAnalytics: () => api.get('/orders/analytics'),
  getAssignedOrders: () => api.get('/orders/assigned'),
  assignOrder: (orderId: string, shipperId: string) => 
    api.patch(`/orders/${orderId}/assign`, { shipperId })
};

// Promotions API
export const promotionsApi = {
  getPromotions: () => api.get('/promotions'),
  getPromotion: (id: string) => api.get(`/promotions/${id}`),
  createPromotion: (data: any) => api.post('/promotions', data),
  updatePromotion: (id: string, data: any) => api.put(`/promotions/${id}`, data),
  deletePromotion: (id: string) => api.delete(`/promotions/${id}`),
  toggleStatus: (id: string) => api.patch(`/promotions/${id}/toggle-status`),
  validatePromoCode: (code: string, orderValue: number) => 
    api.post('/promotions/validate', { code, orderValue })
};

// Staff/User Management API
export const staffApi = {
  getStaff: () => api.get('/users/staff'),
  createStaff: (data: any) => api.post('/users/staff', data),
  updateStaff: (id: string, data: any) => api.put(`/users/staff/${id}`, data),
  deleteStaff: (id: string) => api.delete(`/users/staff/${id}`),
  toggleStaffStatus: (id: string) => api.patch(`/users/staff/${id}/toggle-status`)
};

export { api };