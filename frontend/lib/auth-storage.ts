/**
 * Authentication storage utilities.
 * Handles storing and retrieving authentication tokens.
 */

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

/**
 * Set a cookie with the given name and value.
 */
function setCookie(name: string, value: string, days?: number): void {
  if (!isBrowser) return;

  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
}

/**
 * Get a cookie by name.
 */
function getCookie(name: string): string | null {
  if (!isBrowser) return null;

  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    if (c) {
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
  }
  return null;
}

/**
 * Remove a cookie by name.
 */
function eraseCookie(name: string): void {
  if (!isBrowser) return;

  document.cookie = name + '=; Max-Age=-99999999;';
}

/**
 * Save the access token to both localStorage and cookie.
 */
export function saveToken(token: string): void {
  if (isBrowser) {
    localStorage.setItem('access_token', token);
    // Also save to cookie for server-side access
    setCookie('access_token', token, 7); // 7 days expiry
  }
}

/**
 * Get the access token from localStorage, falling back to cookie.
 */
export function getToken(): string | null {
  if (isBrowser) {
    // Try localStorage first
    const token = localStorage.getItem('access_token');
    if (token) return token;

    // Fall back to cookie
    return getCookie('access_token');
  }
  return null;
}

/**
 * Remove the access token from both localStorage and cookie.
 */
export function removeToken(): void {
  if (isBrowser) {
    localStorage.removeItem('access_token');
    eraseCookie('access_token');
  }
}

/**
 * Save the refresh token to both localStorage and cookie.
 */
export function saveRefreshToken(token: string): void {
  if (isBrowser) {
    localStorage.setItem('refresh_token', token);
    // Also save to cookie for server-side access
    setCookie('refresh_token', token, 30); // 30 days expiry
  }
}

/**
 * Get the refresh token from localStorage, falling back to cookie.
 */
export function getRefreshToken(): string | null {
  if (isBrowser) {
    // Try localStorage first
    const token = localStorage.getItem('refresh_token');
    if (token) return token;

    // Fall back to cookie
    return getCookie('refresh_token');
  }
  return null;
}

/**
 * Remove the refresh token from both localStorage and cookie.
 */
export function removeRefreshToken(): void {
  if (isBrowser) {
    localStorage.removeItem('refresh_token');
    eraseCookie('refresh_token');
  }
}

/**
 * Clear all authentication tokens.
 */
export function clearTokens(): void {
  if (isBrowser) {
    removeToken();
    removeRefreshToken();
  }
}