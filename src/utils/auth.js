// Utility functions for authentication
export const authUtils = {
  // Check if token is expired
  isTokenExpired: (token) => {
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch (error) {
      return true;
    }
  },
  
  // Get user role from token
  getUserRole: (token) => {
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role || null;
    } catch (error) {
      return null;
    }
  },
  
  // Store auth data in localStorage
  storeAuthData: (user, token) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
  },
  
  // Clear auth data from localStorage
  clearAuthData: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  },
  
  // Get stored auth data
  getStoredAuthData: () => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    return {
      user: user ? JSON.parse(user) : null,
      token: token || null
    };
  }
};