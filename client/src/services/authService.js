import api from './api';

/**
 * Authentication Service Client
 */
export const authService = {
  /**
   * Login user
   * @param {string} email
   * @param {string} password
   */
  login: async (email, password) => {
    return await api.post('/auth/login', { email, password });
  },

  /**
   * Get current authenticated user profile
   */
  getMe: async () => {
    return await api.get('/auth/me');
  },

  /**
   * Change user password
   * @param {string} currentPassword
   * @param {string} newPassword
   */
  changePassword: async (currentPassword, newPassword) => {
    return await api.post('/auth/change-password', { currentPassword, newPassword });
  },

  /**
   * Logout user (stateless acknowledgement)
   */
  logout: async () => {
    return await api.post('/auth/logout');
  }
};

export default authService;
