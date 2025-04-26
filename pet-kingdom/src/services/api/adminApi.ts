import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Products API
export const getProducts = () => api.get('/products');
export const createProduct = (product: any) => api.post('/products', product);
export const updateProduct = (id: string, product: any) => api.put(`/products/${id}`, product);
export const deleteProduct = (id: string) => api.delete(`/products/${id}`);
export const toggleProductStatus = (id: string) => api.patch(`/products/${id}/toggle-status`);

// Categories API
export const getCategories = (includeInactive = false) => 
  api.get('/categories', { params: { includeInactive } });
export const createCategory = (category: any) => api.post('/categories', category);
export const updateCategory = (id: string, category: any) => api.put(`/categories/${id}`, category);
export const deleteCategory = (id: string) => api.delete(`/categories/${id}`);
export const toggleCategoryStatus = (id: string) => api.patch(`/categories/${id}/toggle-status`);

// Orders API
export const getOrders = (params?: any) => api.get('/orders', { params });
export const getOrderById = (id: string) => api.get(`/orders/${id}`);
export const updateOrderStatus = (id: string, status: string, note: string = '') => 
  api.patch(`/orders/${id}/status`, { status, note });
export const getOrderAnalytics = (params?: any) => api.get('/orders/analytics', { params });

// Promotions API 
export const getPromotions = (params?: any) => api.get('/promotions', { params });
export const createPromotion = (promotion: any) => api.post('/promotions', promotion);
export const updatePromotion = (id: string, promotion: any) => api.put(`/promotions/${id}`, promotion);
export const deletePromotion = (id: string) => api.delete(`/promotions/${id}`);
export const togglePromotionStatus = (id: string) => api.patch(`/promotions/${id}/toggle-status`);

// Staff Management API
export const getStaff = () => api.get('/users/staff');
export const createStaff = (staff: any) => api.post('/users/staff', staff);
export const updateStaff = (id: string, staff: any) => api.put(`/users/staff/${id}`, staff);
export const deleteStaff = (id: string) => api.delete(`/users/staff/${id}`);
export const toggleStaffStatus = (id: string) => api.patch(`/users/staff/${id}/toggle-status`);

export default api;