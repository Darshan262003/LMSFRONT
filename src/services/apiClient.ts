import axios from 'axios';
import { authStore } from '../stores/authStore.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Check if API base URL is configured
if (!API_BASE_URL || API_BASE_URL.includes('backend-url')) {
  console.warn('⚠️  API Base URL is not configured. Using mock mode.');
  console.warn('📝 To enable API calls, update VITE_API_BASE_URL in your .env file');
}

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to prevent multiple refresh requests
let isRefreshing = false;
let failedQueue = [];

// Process failed queue after token refresh
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Request interceptor - attach Authorization header
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = authStore.getState().accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle 401 and refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is not 401 or request already retried, reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // If already refreshing, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = authStore.getState().refreshToken;
      
      if (!refreshToken) {
        (authStore as any).logout();
        return Promise.reject(error);
      }

      // Call refresh endpoint
      const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
        refreshToken,
      });

      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

      // Update auth store with new tokens
      (authStore as any).refreshAuth(newAccessToken, newRefreshToken);

      // Process queued requests
      processQueue(null, newAccessToken);

      // Retry original request with new token
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      (authStore as any).logout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default apiClient;
