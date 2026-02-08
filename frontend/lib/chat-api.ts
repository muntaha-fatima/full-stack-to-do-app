import { getToken } from '@/lib/auth';

interface ChatRequest {
  message: string;
  conversation_id?: number;
}

interface ChatResponse {
  conversation_id: number;
  response: string;
  tool_calls?: Array<any>;
}

/**
 * Send a chat message to the backend API
 */
export async function sendChatMessage(userId: string, request: ChatRequest): Promise<ChatResponse> {
  const token = getToken();

  if (!token) {
    throw new Error('No authentication token found');
  }

  // Construct the API URL
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';
  const apiUrl = `${baseUrl}/api/v1/${userId}/chat`;

  console.log(`Sending chat request to: ${apiUrl}`);
  console.log(`Using token: ${token.substring(0, 10)}...`); // Only log first 10 chars for security
  console.log(`User ID: ${userId}`);
  console.log(`Request body:`, request);

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    });

    console.log(`Response status: ${response.status}`);

    if (!response.ok) {
      // Try to get error details
      let errorDetails = '';
      try {
        const errorData = await response.json();
        errorDetails = errorData.detail || errorData.message || `Status: ${response.status}`;
      } catch (e) {
        errorDetails = `Status: ${response.status}, Unable to parse error details`;
      }

      throw new Error(`Chat request failed: ${errorDetails}`);
    }

    const responseData = await response.json();
    console.log('Response data:', responseData);
    return responseData;
  } catch (error) {
    console.error('Detailed fetch error:', error);
    
    // Re-throw the error with more context
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(`Network error: Unable to reach the server. Please ensure the backend is running on ${baseUrl}. ${error.message}`);
    }
    
    throw error;
  }
}