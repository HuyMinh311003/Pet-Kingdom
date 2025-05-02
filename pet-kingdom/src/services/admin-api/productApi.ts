import { Product } from '../../types/admin';
import api from './axiosConfig';
export const productApi = {
  getProducts: async (params?: any) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  getProductById: async (id: string) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  createProduct: async (product: Partial<Product>) => {
    const response = await api.post('/products', product);
    return response.data;
  },

  updateProduct: async (id: string, product: Partial<Product>) => {
    const response = await  api.put(`/products/${id}`, product);
    return response.data;
  },

  deleteProduct: async (id: string) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  toggleStatus: async (id: string) => {
    const response = await api.patch(`/products/${id}/toggle-status`);
    return response.data;
  },

  updateStock: async (id: string, quantity: number) => {
    const response = await api.patch(`/products/${id}/stock`, { quantity });
    return response.data;
  },

  getProductsByCategory: async (
    categoryId: string
  ): Promise<{
    success: boolean;
    data: { products: Product[]; pagination?: any };
    message?: string;
  }> => {
    const response = await api.get('/products', {
      params: { category: categoryId }
    });
    return response.data;
  },

  // uploadImage rồi trả về đúng url
  uploadImage: async (imageData: FormData): Promise<{
    success: boolean;
    url: string;
    message?: string;
  }> => {
    const response = await api.post('/products/upload', imageData);
    return response.data;
  },
};