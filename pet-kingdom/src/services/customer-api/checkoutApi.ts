import axios from '../admin-api/axiosConfig'; // file config sẵn axios, nếu có

export const getCheckoutInfo = async () => {
  return axios.get('/checkout');
};

export const placeOrder = async (data: {
  shippingAddress: string;
  phone: string;
  paymentMethod: 'COD' | 'Bank Transfer';
  notes?: string;
  promoCode?: string;
}) => {
  const res = await axios.post('/checkout', data);
  return res.data;
};
