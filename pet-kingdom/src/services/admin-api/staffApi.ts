import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

export const staffApi = {
  getStaffList: async () => {
    const response = await axios.get(`${BASE_URL}/users/staff`);
    return response.data;
  },

  createStaff: async (staffData: any) => {
    const response = await axios.post(`${BASE_URL}/users/staff`, staffData);
    return response.data;
  },

  updateStaff: async (id: string, staffData: any) => {
    const response = await axios.put(`${BASE_URL}/users/staff/${id}`, staffData);
    return response.data;
  },

  deleteStaff: async (id: string) => {
    const response = await axios.delete(`${BASE_URL}/users/staff/${id}`);
    return response.data;
  },

  toggleStaffStatus: async (id: string) => {
    const response = await axios.patch(`${BASE_URL}/users/${id}/toggle-status`);
    return response.data;
  }
};