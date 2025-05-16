// src/apis/profileApi.ts
import axios from '../admin-api/axiosConfig';
import { User } from '../../types/user';

interface ProfileResponse {
  success: boolean;
  data: User;
}

interface UpdateProfilePayload {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string | null;
}

interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

// GET /users/profile/:id
export const getProfile = (id: string): Promise<{ data: ProfileResponse }> => {
  return axios.get(`/users/profile/${id}`);
};

// PUT /users/profile/:id
export const updateProfile = (
  id: string,
  payload: UpdateProfilePayload
): Promise<{ data: ProfileResponse }> => {
  return axios.put(`/users/profile/${id}`, payload);
};

// PUT /users/profile/:id/password
export const changePassword = (
  id: string,
  payload: ChangePasswordPayload
): Promise<{ data: { success: boolean; message: string } }> => {
  return axios.put(`/users/profile/${id}/password`, payload);
};
