import api from './api';

const authService = {
  // Customer signup
  register: async (mobile, password) => {
    const response = await api.post('/api/auth/customer/signup', {
      mobile,
      password,
    });
    return response.data;
  },

  // Customer login
  login: async (username, password) => {
    const response = await api.post('/api/auth/customer/login', {
      username,
      password,
    });
    return response.data;
  },

  // Admin login
  adminLogin: async (username, password) => {
    const response = await api.post('/api/auth/admin/login', {
      username,
      password,
    });
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
  },
};

export default authService; 