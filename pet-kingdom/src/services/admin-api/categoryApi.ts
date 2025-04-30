import { Category, CategoryResponse } from '../../types/category';
import { api } from '../customer-api/api';

export const categoryService = {
    getCategoriesByType: async (type: 'pets' | 'tools'): Promise<Category[]> => {
        try {
            const response = await api.get<CategoryResponse>(`/categories?type=${type}`);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    },

    getCategoryChildren: async (categoryId: string): Promise<Category[]> => {
        try {
            const response = await api.get<CategoryResponse>(`/categories/${categoryId}/children`);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching category children:', error);
            return [];
        }
    }
};