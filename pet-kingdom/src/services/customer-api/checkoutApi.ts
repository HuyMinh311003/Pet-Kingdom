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
  name: string;
}) => {
  const res = await axios.post('/checkout', data);
  return res.data;
};

export interface ZaloQrResponse {
  orderUrl: string;
  zpTransToken: string;
  apptransid: string;
}

export const createZaloPayment = async (
  orderId: string,
  paymentChannel: 'APP' | 'CARD'
): Promise<ZaloQrResponse> => {
  const bankCode = paymentChannel === 'CARD'
    ? 'CC' : 'zalopayapp';
  const res = await axios.post<{
    success: boolean;
    data: { order_url: string; zp_trans_token: string; apptransid: string };
  }>('/payments/zalo-qr', { orderId, bankCode });
  const payload = res.data.data;
  return {
    orderUrl: payload.order_url,
    zpTransToken: payload.zp_trans_token,
    apptransid: payload.apptransid
  };
};