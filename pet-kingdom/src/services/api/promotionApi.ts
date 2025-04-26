import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

export const promotionApi = {
  getPromotions: async () => {
    const response = await axios.get(`${BASE_URL}/promotions`);
    return response.data;
  },

  getPromotionById: async (id: string) => {
    const response = await axios.get(`${BASE_URL}/promotions/${id}`);
    return response.data;
  },

  createPromotion: async (promotionData: any) => {
    const response = await axios.post(`${BASE_URL}/promotions`, promotionData);
    return response.data;
  },

  updatePromotion: async (id: string, promotionData: any) => {
    const response = await axios.put(`${BASE_URL}/promotions/${id}`, promotionData);
    return response.data;
  },

  deletePromotion: async (id: string) => {
    const response = await axios.delete(`${BASE_URL}/promotions/${id}`);
    return response.data;
  },

  validatePromoCode: async (code: string, orderValue: number) => {
    const response = await axios.post(`${BASE_URL}/promotions/validate`, { 
      code, 
      orderValue 
    });
    return response.data;
  }
};