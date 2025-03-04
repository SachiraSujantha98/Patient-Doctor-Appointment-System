import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { config } from '../config/env.config';
import { ApiError } from '../types';
import { csrfManager, validateCsrfToken, setupCsrfProtection } from '../utils/csrf';

const api = axios.create({
  baseURL: config.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Required for CSRF token cookie
});

// Initialize CSRF protection
setupCsrfProtection(api).catch(console.error);

// Request interceptor
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Add auth token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add CSRF token for non-GET requests
    if (config.method !== 'get') {
      if (csrfManager.needsRefresh()) {
        await setupCsrfProtection(api);
      }
      const csrfToken = csrfManager.getToken();
      if (csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken;
      } else {
        throw new Error('CSRF token not available');
      }
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Validate CSRF token for non-GET responses
    if (response.config.method !== 'get') {
      const csrfToken = response.config.headers['X-CSRF-Token'];
      if (csrfToken && !validateCsrfToken(csrfToken as string)) {
        csrfManager.clearToken();
        throw new Error('CSRF token validation failed');
      }
    }
    return response;
  },
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      csrfManager.clearToken();
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      // Handle CSRF token errors
      csrfManager.clearToken();
      setupCsrfProtection(api).catch(console.error);
    }
    return Promise.reject(error);
  }
);

export default api; 