/**
 * Authentication context using our custom authentication system.
 */

'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { login as authLogin, register as authRegister, logout as authLogout, isAuthenticated as checkAuth, getToken, getUser } from '@/lib/auth';
import { User } from '@/types/user';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email_or_username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, confirm_password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setLoading(true);
        const authenticated = await checkAuth();
        if (authenticated) {
          try {
            // If authenticated, fetch user data from the API
            const userData = await getUser();
            if (userData) {
              setUser(userData);
            } else {
              // If we can't get user data, log out
              await authLogout();
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
            // If there's an error getting user data, treat as not authenticated
            await authLogout();
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
        setIsInitialized(true);
      }
    };

    checkAuthStatus();
  }, []);

  // Effect to handle token expiration in the background
  useEffect(() => {
    if (!isInitialized) return;

    const interval = setInterval(async () => {
      // Periodically check if the token is still valid
      const isValid = await checkAuth();
      if (!isValid && user) {
        // If the token is no longer valid but we still have a user in state, log out
        setUser(null);
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [user, isInitialized]);

  const login = async (email_or_username: string, password: string) => {
    setLoading(true);
    try {
      const response = await authLogin({ email_or_username, password });
      // The login response already contains user data
      setUser(response.user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string, confirm_password: string) => {
    setLoading(true);
    try {
      await authRegister({ username, email, password, confirm_password });
      // After registration, user needs to verify email, so they're not automatically logged in
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    await authLogout();
    setUser(null);
    setLoading(false);
  };

  // Only provide values after initialization to prevent hydration mismatches
  const value = {
    user: isInitialized ? user : null,
    token: isInitialized ? getToken() : null,
    login,
    register,
    logout,
    loading: !isInitialized || loading, // Still loading until initialized
    isAuthenticated: isInitialized && !!user, // Use user presence as auth indicator
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}