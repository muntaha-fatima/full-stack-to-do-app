// This route handles CORS and forwards requests to the backend authentication API
import { NextRequest } from "next/server";

// Handle CORS preflight requests
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');

  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': origin || '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}

export async function GET(request: NextRequest) {
  // Extract the auth action from the URL
  const { pathname, search } = new URL(request.url);
  const authAction = pathname.replace('/api/auth/', '');

  // Forward the request to the backend auth API
  const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/${authAction}${search}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...request.headers,
    },
    credentials: 'include',
  });

  const data = await backendResponse.json();

  const response = new Response(JSON.stringify(data), {
    status: backendResponse.status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': request.headers.get('origin') || '*',
      'Access-Control-Allow-Credentials': 'true',
    },
  });

  return response;
}

export async function POST(request: NextRequest) {
  // Extract the auth action from the URL
  const { pathname } = new URL(request.url);
  const authAction = pathname.replace('/api/auth/', '');

  // Forward the request to the backend auth API
  const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/${authAction}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...request.headers,
    },
    credentials: 'include',
    body: await request.text(),
  });

  const data = await backendResponse.json();

  const response = new Response(JSON.stringify(data), {
    status: backendResponse.status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': request.headers.get('origin') || '*',
      'Access-Control-Allow-Credentials': 'true',
    },
  });

  return response;
}