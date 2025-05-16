import api from './axiosConfig';
import { User } from '../../types/user';

export const staffApi = {
  getStaffList: async (): Promise<User[]> => {
    const response = await api.get('/users', { params: { role: 'Shipper' } });
    return response.data.data.users;
  },

  createStaff: async (staffData: Partial<User>): Promise<{ success: boolean; data: User }> => {
    const response = await api.post('/users/staff', {
      ...staffData,
      role: 'Shipper',
    });
    return response.data;
  },

  updateStaff: async (id: string, staffData: Partial<User>): Promise<{ success: boolean; data: User }> => {
    const response = await api.put(`/users/profile/${id}`, staffData);
    return response.data;
  },

  toggleStaffStatus: async (id: string): Promise<{ success: boolean; data: User }> => {
    const response = await api.patch(`/users/${id}/toggle-status`);
    return response.data;
  },
  deleteStaff: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  }
};  