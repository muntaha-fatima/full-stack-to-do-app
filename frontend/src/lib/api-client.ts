/**
 * API client configuration with Better Auth integration.
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getAuthToken } from './auth'; // Import our auth client and token function

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://shazsabir-to-do-backend.hf.space';

/**
 * Create axios instance with default configuration.
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_URL}/api`, // Updated to match backend API structure
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor for adding Better Auth tokens.
 */
apiClient.interceptors.request.use(
  async (config) => {
    // Get Better Auth session to access the token
    try {
      // Get session token using our helper function
      const token = await getAuthToken();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('Could not get Better Auth session for API request:', error);
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
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // In Better Auth, session refresh is handled automatically
      // We'll redirect to login if authentication fails
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
 * Get user profile from the existing backend.
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
      throw new Error(error.response?.data?.detail || error.response?.data?.error?.message || error.message);
    }
    throw error;
  }
}

export default apiClient;