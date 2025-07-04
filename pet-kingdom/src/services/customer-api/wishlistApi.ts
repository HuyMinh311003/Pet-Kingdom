import { api } from './api';
import { Product } from '../../types/product';

export interface WishlistResponse {
  success: boolean;
  data: {
    products: Product[];
  };
  message?: string;
}

export interface WishlistCheckResponse {
  success: boolean;
  data: {
    isInWishlist: boolean;
  };
}

export const wishlistApi = {
  // Get user's wishlist
  getWishlist: async (userId: string): Promise<WishlistResponse> => {
    const response = await api.get(`/wishlist/${userId}`);
    return response.data;
  },

  // Add a product to wishlist
  addToWishlist: async (userId: string, productId: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.post(`/wishlist/${userId}/items`, { productId });
    return response.data;
  },

  // Remove a product from wishlist
  removeFromWishlist: async (userId: string, productId: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/wishlist/${userId}/items/${productId}`);
    return response.data;
  },

  // Check if a product is in the wishlist
  checkWishlistItem: async (userId: string, productId: string): Promise<WishlistCheckResponse> => {
    const response = await api.get(`/wishlist/${userId}/items/${productId}`);
    return response.data;
  },

  // Clear the entire wishlist
  clearWishlist: async (userId: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/wishlist/${userId}`);
    return response.data;
  }
}; 