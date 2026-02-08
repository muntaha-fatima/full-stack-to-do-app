import { useState, useEffect } from 'react';

// Using the existing authentication system with the new UI
// We'll import the functions directly from the original auth file
import { login, logout, register as originalRegister, getUser, getToken } from '@/lib/auth';

// Mock signIn implementation to work with existing auth system
export const signIn = {
  email: async (credentials: { email: string; password: string; options?: { callbackURL?: string } }) => {
    try {
      const result = await login({
        email_or_username: credentials.email,
        password: credentials.password
      });

      // Redirect to callback URL if provided, otherwise default to dashboard
      if (credentials.options?.callbackURL) {
        window.location.href = credentials.options.callbackURL;
      } else {
        window.location.href = '/dashboard';
      }

      return { error: null, data: result };
    } catch (error: any) {
      return { error: { message: error.message }, data: null };
    }
  },
  social: async ({ provider, callbackURL }: { provider: string; callbackURL: string }) => {
    // Social sign-in is not implemented in the existing system
    // This would redirect to the social provider's OAuth flow
    console.log(`Initiating ${provider} sign-in`);
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/${provider}`;
  }
};

// Mock signOut implementation
export const signOut = async () => {
  try {
    await logout();
    window.location.href = '/login';
  } catch (error) {
    console.error('Error during logout:', error);
  }
};

// Real useSession hook implementation
export const useSession = () => {
  // This returns real session data from the authentication system
  const [session, setSession] = useState<{
    data: { user: any } | null;
    status: 'loading' | 'authenticated' | 'unauthenticated';
  }>({ data: null, status: 'loading' });

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const token = getToken();
        if (token) {
          const user = await getUser();
          if (user) {
            setSession({ data: { user }, status: 'authenticated' });
          } else {
            setSession({ data: null, status: 'unauthenticated' });
          }
        } else {
          setSession({ data: null, status: 'unauthenticated' });
        }
      } catch (error) {
        setSession({ data: null, status: 'unauthenticated' });
      }
    };

    fetchSession();
  }, []);

  return session;
};

// Export register function as well
export { originalRegister as register };

