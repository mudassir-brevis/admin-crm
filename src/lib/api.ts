import axios from 'axios';

const apiProtocol = process.env.NEXT_PUBLIC_API_PROTOCOL || 'http';
const apiIp = process.env.NEXT_PUBLIC_API_IP || 'localhost';
const apiPort = process.env.NEXT_PUBLIC_API_PORT || '5000';
export const ADMIN_API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || `${apiProtocol}://${apiIp}:${apiPort}/api/v1`
).replace(/\/$/, '');

export const adminApi = axios.create({
  baseURL: ADMIN_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Inject token
adminApi.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('crm_admin_access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor: handle 401
adminApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        localStorage.removeItem('crm_admin_access_token');
        localStorage.removeItem('crm_admin_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
