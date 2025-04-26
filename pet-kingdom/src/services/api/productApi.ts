import axios from 'axios';
import { Product } from '../../types/admin';

const BASE_URL = 'http://localhost:5000/api';

export const productApi = {
  getProducts: async (params?: any) => {
    const response = await axios.get(`${BASE_URL}/products`, { params });
    return response.data;
  },

  getProductById: async (id: string) => {
    const response = await axios.get(`${BASE_URL}/products/${id}`);
    return response.data;
  },

  createProduct: async (product: Partial<Product>) => {
    const response = await axios.post(`${BASE_URL}/products`, product);
    return response.data;
  },

  updateProduct: async (id: string, product: Partial<Product>) => {
    const response = await axios.put(`${BASE_URL}/products/${id}`, product);
    return response.data;
  },

  deleteProduct: async (id: string) => {
    const response = await axios.delete(`${BASE_URL}/products/${id}`);
    return response.data;
  },

  toggleStatus: async (id: string) => {
    const response = await axios.patch(`${BASE_URL}/products/${id}/toggle-status`);
    return response.data;
  },

  updateStock: async (id: string, quantity: number) => {
    const response = await axios.patch(`${BASE_URL}/products/${id}/stock`, { quantity });
    return response.data;
  }
};