/**
 * Enhanced API client configuration with improved security and token management.
 */

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getToken as getStoredToken, saveToken, clearTokens } from './auth-storage';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

/**
 * Create axios instance with default configuration.
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 15000, // Increased timeout
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include credentials (cookies) in requests
});

/**
 * Request interceptor for adding auth tokens.
 */
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = getStoredToken(); // Use the function from auth-storage instead of direct localStorage access
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for handling errors.
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Try to refresh token using the same function from auth.ts
      try {
        // Use the same refresh function as in auth.ts to ensure consistency
        const refreshResponse = await fetch(`${API_URL}/api/v1/auth/refresh`, {
          method: 'POST',
          credentials: 'include', // Important: include cookies for refresh token
        });

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();

          // Update token in storage using the same function as auth.ts
          saveToken(refreshData.access_token);

          // Update the original request with the new token
          (originalRequest.headers as Record<string, string>).Authorization = `Bearer ${refreshData.access_token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh error:', refreshError);
      }

      // If refresh failed, redirect to login
      clearTokens(); // Use the function from auth-storage
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Handle 403 errors (forbidden)
    if (error.response?.status === 403) {
      // Log this error if needed for monitoring
    }

    return Promise.reject(error);
  }
);

/**
 * Get user profile.
 */
export async function getProfile(): Promise<unknown> {
  try {
    const response = await apiClient.get('/v1/auth/me');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || error.message || 'Failed to get profile');
    }
    throw error;
  }
}

/**
 * Generic API request function.
 */
export async function apiRequest<T>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  try {
    const response: AxiosResponse<T> = await apiClient.request({
      method,
      url,
      data,
      ...config,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Extract detailed error information
      const errorMessage = error.response?.data?.detail ||
                          error.response?.data?.error?.message ||
                          error.response?.data?.message ||
                          error.message ||
                          'Unknown error occurred';

      throw new Error(errorMessage);
    }
    throw error;
  }
}

export default apiClient;
