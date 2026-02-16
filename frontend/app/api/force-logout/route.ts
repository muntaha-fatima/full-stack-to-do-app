import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  // Get the cookies instance
  const cookieStore = cookies();

  // Delete all authentication-related cookies
  cookieStore.delete('refresh_token');
  cookieStore.delete('access_token');
  cookieStore.delete('authjs.session-token');

  // Return a response indicating successful logout
  return NextResponse.json({ 
    message: 'Successfully cleared all authentication cookies. You can now access the login page.' 
  });
}