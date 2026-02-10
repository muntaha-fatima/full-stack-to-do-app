import { redirect } from "next/navigation";
import { getUserFromServer } from "./server-auth";

/**
 * Server-side function to check if user is authenticated by checking for auth token in cookies
 * @returns User session data if authenticated, redirects to login if not
 */
export async function requireAuth() {
  // Get user data using server-side authentication
  const user = await getUserFromServer();

  if (!user) {
    // If we can't get user data, redirect to login
    redirect('/login');
  }

  return { user };
}

/**
 * Server-side function to check if user is authenticated
 * @returns User session data if authenticated, null otherwise
 */
export async function requireAuthSilent() {
  // Get user data using server-side authentication
  const user = await getUserFromServer();

  if (!user) {
    // If we can't get user data, return null instead of redirecting
    return null;
  }

  return { user };
}

/**
 * Server-side function to check if user is NOT authenticated
 * Redirects to dashboard if already logged in
 */
export async function requireGuest() {
  // Get user data using server-side authentication
  const user = await getUserFromServer();

  if (user) {
    redirect('/dashboard');
  }
}

/**
 * Server-side function to get current user session without redirecting
 * @returns User session data if authenticated, null otherwise
 */
export async function getCurrentUser() {
  const user = await getUserFromServer();
  if (user) {
    return { user };
  }
  return null;
}