import axios from 'axios';
import { Product } from '../../types/admin';

const API_URL = 'http://localhost:5000/api/products';

export const productService = {
  getProducts: async () => {
    const response = await axios.get(API_URL);
    return response.data.data.products;
  },

  createProduct: async (product: Partial<Product>) => {
    const response = await axios.post(API_URL, product);
    return response.data.data;
  },

  updateProduct: async (id: string, product: Partial<Product>) => {
    const response = await axios.put(`${API_URL}/${id}`, product);
    return response.data.data;
  },

  deleteProduct: async (id: string) => {
    await axios.delete(`${API_URL}/${id}`);
  },

  toggleStatus: async (id: string) => {
    const response = await axios.patch(`${API_URL}/${id}/toggle-status`);
    return response.data.data; 
  },
  
  updateStock: async (id: string, quantity: number) => {
    const response = await axios.patch(`${API_URL}/${id}/stock`, { quantity });
    return response.data.data;
  }
};