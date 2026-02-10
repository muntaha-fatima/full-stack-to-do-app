// Using the existing authentication system with the new UI
// We'll import the functions directly from the original auth file
import { login, logout, register } from '@/lib/auth';

// Mock signIn implementation to work with existing auth system
export const signIn = {
  email: async (credentials: { email: string; password: string; options?: { callbackURL?: string } }) => {
    try {
      const result = await login({
        email_or_username: credentials.email,
        password: credentials.password
      });

      // Redirect to callbackURL if provided, otherwise default to dashboard
      const callbackURL = credentials.options?.callbackURL || '/dashboard';
      window.location.href = callbackURL;

      return { error: null, data: result };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return { error: { message: error.message }, data: null };
      } else {
        return { error: { message: String(error) }, data: null };
      }
    }
  },
  social: async ({ provider, _callbackURL }: { provider: string; _callbackURL: string }) => {
    // Social sign-in is not implemented in the existing system
    // This would redirect to the social provider's OAuth flow
    // Using _callbackURL to satisfy TypeScript
    if (!_callbackURL) {
      console.warn('Warning: callbackURL is not provided for social login');
    }
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/${provider}`;
  }
};

// Mock signOut implementation
export const signOut = async () => {
  try {
    await logout();
    window.location.href = '/login';
  } catch (error: unknown) {
    console.error('Error during logout:', error);
  }
};

// Mock useSession hook
export const useSession = () => {
  // This would normally return session data
  // For now, we'll return a mock implementation
  const session = { data: null, status: 'unauthenticated' };
  return { data: session, status: 'unauthenticated' };
};

// Export register function as well
export { register };

// Export getAuthToken function
export const getAuthToken = async (): Promise<string | null> => {
  // In this implementation, we'll use the existing auth system
  // This is a simplified version - in a real implementation you'd get the token differently
  if (typeof window !== 'undefined') {
    // Client-side implementation
    const token = localStorage.getItem('access_token');
    return token;
  }
  return null;
};