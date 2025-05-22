import api from './axiosConfig';

export interface ShippingConfig {
  shippingFee: number;
  updatedAt: string;
  updatedBy: string;
}

export interface DiscountTier {
  minSubtotal: number;
  discountPercentage: number;
}

export interface DiscountConfig {
  tiers: DiscountTier[];
  isActive: boolean;
  updatedAt: string;
  updatedBy: string;
}

export const configApi = {
  getShippingConfig: async (): Promise<{
    success: boolean;
    data: ShippingConfig;
  }> => {
    const response = await api.get('/config/shipping');
    return response.data;
  },

  updateShippingConfig: async (data: { 
    shippingFee: number 
  }): Promise<{
    success: boolean;
    data: ShippingConfig;
    message: string;
  }> => {
    const response = await api.put('/config/shipping', data);
    return response.data;
  },

  getDiscountConfig: async (): Promise<{
    success: boolean;
    data: DiscountConfig;
  }> => {
    const response = await api.get('/config/discount');
    return response.data;
  },

  updateDiscountConfig: async (data: {
    tiers: DiscountTier[];
    isActive: boolean;
  }): Promise<{
    success: boolean;
    data: DiscountConfig;
    message: string;
  }> => {
    const response = await api.put('/config/discount', data);
    return response.data;
  },

  toggleDiscountSystem: async (data: {
    isActive: boolean;
  }): Promise<{
    success: boolean;
    data: DiscountConfig;
    message: string;
  }> => {
    const response = await api.put('/config/discount/toggle', data);
    return response.data;
  }
}; 