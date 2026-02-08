/**
 * Enhanced authentication service with improved security and error handling.
 * Updated to work with the backend authentication API.
 */

import type { User } from '@/types/user';
import { saveToken, saveRefreshToken, clearTokens, getToken as getStoredToken, getRefreshToken } from './auth-storage';

export interface LoginCredentials {
  email_or_username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user?: User; // Optional for refresh responses
}

export interface AuthResponse extends TokenResponse {
  user: User;
}

/**
 * Refresh the access token using the refresh token.
 */
export async function refreshToken(): Promise<TokenResponse | null> {
  try {
    // Refresh token is handled via cookies, so we don't need to send it in the request body
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'}/api/v1/auth/refresh`, {
      method: 'POST',
      credentials: 'include', // Include cookies in the request
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // If refresh token is invalid/expired, clear all tokens
      if (response.status === 401) {
        clearTokens();
      }
      throw new Error(`Token refresh failed with status: ${response.status}`);
    }

    const tokenData: TokenResponse = await response.json();

    // Update token in storage (refresh token is handled via cookies)
    saveToken(tokenData.access_token);

    return tokenData;
  } catch (error) {
    console.error('Token refresh error:', error);
    // Clear tokens if refresh fails to prevent repeated failed attempts
    clearTokens();
    return null;
  }
}

/**
 * Verify if the access token is still valid by attempting to fetch user profile.
 */
export async function verifyToken(): Promise<boolean> {
  try {
    const token = getStoredToken();
    if (!token) {
      return false;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'}/api/v1/auth/me`, {
      credentials: 'include', // Include cookies in the request
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    return response.ok;
  } catch (error) {
    console.error('Token verification error:', error);
    return false;
  }
}

/**
 * Login user and store tokens.
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'}/api/v1/auth/login`, {
    method: 'POST',
    credentials: 'include', // Include cookies in the request
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      email_or_username: credentials.email_or_username,
      password: credentials.password
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Login failed with status: ${response.status}`);
  }

  const tokenData: TokenResponse = await response.json();

  // Store access token in storage (refresh token is handled via cookies)
  saveToken(tokenData.access_token);

  // Fetch user profile after successful login
  const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'}/api/v1/auth/me`, {
    credentials: 'include', // Include cookies in the request
    headers: {
      'Authorization': `Bearer ${tokenData.access_token}`,
      'Accept': 'application/json',
    },
  });

  if (!userResponse.ok) {
    const errorData = await userResponse.json().catch(() => ({}));
    throw new Error(errorData.detail || `Failed to fetch user profile: ${userResponse.status}`);
  }

  const userData: User = await userResponse.json();

  return {
    ...tokenData,
    user: userData,
  };
}

/**
 * Register a new user.
 */
export async function register(registrationData: RegisterData): Promise<{message: string}> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'}/api/v1/auth/register`, {
    method: 'POST',
    credentials: 'include', // Include cookies in the request
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: registrationData.email,
      password: registrationData.password,
      username: registrationData.username,
      confirm_password: registrationData.confirm_password
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Registration failed');
  }

  const result = await response.json();
  return result;
}

/**
 * Logout user and remove tokens.
 */
export async function logout(): Promise<void> {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'}/api/v1/auth/logout`, {
      method: 'POST',
      credentials: 'include', // Include cookies in the request
    });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Clear tokens from storage regardless of API response
    clearTokens();
  }
}

/**
 * Check if user is authenticated.
 */
export async function isAuthenticated(): Promise<boolean> {
  const token = getStoredToken();
  if (!token) {
    return false;
  }

  // First check if the token is still valid
  const isValid = await verifyToken();
  if (!isValid) {
    // If not valid, try to refresh it
    const refreshed = await refreshToken();
    return !!refreshed;
  }

  return true;
}

/**
 * Get the current user's token.
 */
export function getToken(): string | null {
  return getStoredToken();
}

/**
 * Get the current user's profile.
 */
export async function getUser(): Promise<User | null> {
  try {
    // First verify that we have a token
    const token = getStoredToken();
    if (!token) {
      console.warn('No token found for user retrieval');
      return null;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'}/api/v1/auth/me`, {
      credentials: 'include', // Include cookies in the request
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      // If we get a 401, try to refresh the token and retry the request
      if (response.status === 401) {
        console.log('Token expired, attempting refresh...');
        const refreshed = await refreshToken();
        if (refreshed) {
          // Retry the request with the new token
          const retryResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'}/api/v1/auth/me`, {
            credentials: 'include', // Include cookies in the request
            headers: {
              'Authorization': `Bearer ${getStoredToken()}`,
              'Accept': 'application/json',
            },
          });

          if (!retryResponse.ok) {
            console.error(`Failed to fetch user after refresh: ${retryResponse.status}`, await retryResponse.text());
            return null;
          }

          const userData: User = await retryResponse.json();
          return userData;
        } else {
          // If refresh failed, clear tokens and return null
          console.warn('Token refresh failed, clearing tokens');
          clearTokens();
          return null;
        }
      } else {
        console.error(`Failed to fetch user: ${response.status}`, await response.text());
        return null;
      }
    }

    const userData: User = await response.json();
    return userData;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
}