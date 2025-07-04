import { Category } from '../../types/category';
import api from './axiosConfig';

export const categoryApi = {
  getCategories: async (includeInactive: boolean): Promise<{
    success: boolean;
    data: Category[];
  }> => {
    const response = await api.get('/categories', {
      params: { includeInactive }
    });
    return response.data;
  },

  createCategory: async (category: Partial<Category>): Promise<{
    success: boolean;
    data: Category;
    message?: string;
  }> => {
    const response = await api.post('/categories', category);
    return response.data;
  },

  updateCategory: async (id: string, updates: Partial<Category>): Promise<{
    success: boolean;
    data: Category;
    message?: string;
  }> => {
    const response = await api.put(`/categories/${id}`, updates);
    return response.data;
  },

  deleteCategory: async (id: string): Promise<{
    success: boolean;
    message?: string;
  }> => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },

  toggleCategoryStatus: async (id: string): Promise<{
    success: boolean;
    data: { id: string; isActive: boolean };
    message?: string;
  }> => {
    const response = await api.patch(`/categories/${id}/toggle-status`);
    return response.data;
  },
};
