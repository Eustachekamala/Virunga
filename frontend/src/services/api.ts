import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { useAuthStore } from '../stores/authStore';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8765',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/v1/users/login',
  REGISTER: '/api/v1/users/register',
  
  // Users
  USERS: '/api/v1/users',
  USER_PROFILE: '/api/v1/users/profile',
  
  // Products
  PRODUCTS: '/api/v1/products',
  PRODUCT_BY_ID: (id: string) => `/api/v1/products/${id}`,
  PRODUCTS_BY_TYPE: (type: string) => `/api/v1/products/type/${type}`,
  
  // Health checks
  HEALTH: '/actuator/health',
  METRICS: '/actuator/metrics',
};

// Generic API methods
export const apiService = {
  get: <T>(url: string, config = {}) => api.get<T>(url, config),
  post: <T>(url: string, data = {}, config = {}) => api.post<T>(url, data, config),
  put: <T>(url: string, data = {}, config = {}) => api.put<T>(url, data, config),
  patch: <T>(url: string, data = {}, config = {}) => api.patch<T>(url, data, config),
  delete: <T>(url: string, config = {}) => api.delete<T>(url, config),
};

export default api;
