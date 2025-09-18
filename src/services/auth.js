import api from './api';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data; // { token, role }
  },

  getProfile: async () => {
    const response = await api.get('/user/me');
    return response.data; // full user object
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  requestPasswordReset: async (email) => {
    const response = await api.post('/password/request', { email });
    return response.data;
  },

  resetPassword: async (token, newPassword) => {
    const response = await api.post('/password/perform', { token, newPassword });
    return response.data;
  }
};
