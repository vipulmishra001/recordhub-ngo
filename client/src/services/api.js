import axios from 'axios';

const getBaseURL = () => {
  let url = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1').trim();
  url = url.replace(/\/+$/, '');
  if (!url.endsWith('/api/v1') && !url.includes('/api/')) {
    url = `${url}/api/v1`;
  }
  return url;
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// List of public endpoints that don't need Authorization header
const publicEndpoints = ['/auth/login', '/health'];

// Request Interceptor: Attach JWT Token to authenticated requests
api.interceptors.request.use(
  (config) => {
    const isPublic = publicEndpoints.some((url) => config.url?.endsWith(url));
    if (!isPublic) {
      const token = localStorage.getItem('ngo_auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global Error and 401 Unauthorized handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and broadcast session expiration
      localStorage.removeItem('ngo_auth_token');
      localStorage.removeItem('ngo_user_data');
      window.dispatchEvent(new Event('auth:unauthorized'));
    }
    return Promise.reject(
      error.response?.data || {
        success: false,
        message: error.message || 'Network error occurred',
      }
    );
  }
);

export default api;
