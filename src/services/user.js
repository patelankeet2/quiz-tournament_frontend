import api from './api';

export const userService = {
  getProfile: async () => {
    const response = await api.get('/user/me');
    return response.data;
  },
  
  updateProfile: async (userData) => {
    const response = await api.put('/user/profile', userData);
    return response.data;
  },
  
  changePassword: async (currentPassword, newPassword) => {
    const response = await api.put('/user/password', {
      currentPassword,
      newPassword
    });
    return response.data;
  }
};