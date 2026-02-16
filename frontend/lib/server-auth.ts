/**
 * Server-side authentication utilities
 * These functions work in server-side contexts like middleware and server components
 */

import { cookies, headers } from 'next/headers';
import { User } from '@/types/user';

/**
 * Get user from backend API using server-side fetch
 * This function works in server-side contexts where localStorage is not available
 */
export async function getUserFromServer(): Promise<User | null> {
  try {
    // Get the auth token from cookies
    const cookieStore = cookies();
    let authToken =
      cookieStore.get('authjs.session-token')?.value ||
      cookieStore.get('access_token')?.value;

    // If not found in cookies, try to get from Authorization header (for API routes)
    if (!authToken) {
      // This won't work in server components, but keeping for completeness
      // In practice, for server components, we rely on cookies
      const authHeader = headers().get('authorization') || headers().get('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        authToken = authHeader.substring(7);
      }
    }

    if (!authToken) {
      console.warn('No auth token found in cookies or headers');
      return null;
    }

    // Make a server-side fetch to the backend to verify the token and get user data
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'}/api/v1/auth/me`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Accept': 'application/json',
        // Include cookies in the request to the backend
        // This is important as the backend might use cookies for session management
      },
      // credentials: 'include', // This doesn't work in server-side fetch, so we pass token in header
    });

    if (!response.ok) {
      console.error(`Failed to fetch user from server: ${response.status}`, await response.text());
      return null;
    }

    const userData: User = await response.json();
    return userData;
  } catch (error) {
    console.error('Server-side get user error:', error);
    return null;
  }
}

/**
 * Verify if user is authenticated server-side
 */
export async function isUserAuthenticatedOnServer(): Promise<boolean> {
  try {
    const user = await getUserFromServer();
    return !!user;
  } catch (error) {
    console.error('Server-side auth check error:', error);
    return false;
  }
}