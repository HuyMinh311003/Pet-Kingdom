import axios from 'axios';
import { Category } from '../../types/admin';

const BASE_URL = 'http://localhost:5000/api';

export const categoryApi = {
  getCategories: async (includeInactive = false) => {
    const response = await axios.get(`${BASE_URL}/categories`, {
      params: { includeInactive }
    });
    return response.data;
  },

  getCategoryById: async (id: string) => {
    const response = await axios.get(`${BASE_URL}/categories/${id}`);
    return response.data;
  },

  createCategory: async (category: Partial<Category>) => {
    const response = await axios.post(`${BASE_URL}/categories`, category);
    return response.data;
  },

  updateCategory: async (id: string, category: Partial<Category>) => {
    const response = await axios.put(`${BASE_URL}/categories/${id}`, category);
    return response.data;
  },

  deleteCategory: async (id: string) => {
    const response = await axios.delete(`${BASE_URL}/categories/${id}`);
    return response.data;
  },

  toggleStatus: async (id: string) => {
    const response = await axios.patch(`${BASE_URL}/categories/${id}/toggle-status`);
    return response.data;
  }
};