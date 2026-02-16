import { getToken } from '@/lib/auth';

interface ChatRequest {
  message: string;
  conversation_id?: number;
}

interface ChatResponse {
  conversation_id: number;
  response: string;
  tool_calls?: Array<Record<string, unknown>>;
}

/**
 * Send a chat message to the backend API
 */
export async function sendChatMessage(userId: string, request: ChatRequest): Promise<ChatResponse> {
  const token = getToken();

  if (!token) {
    throw new Error('No authentication token found');
  }

  // Construct the API URL - user ID is extracted from JWT token on backend
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';
  const apiUrl = `${baseUrl}/api/v1/${userId}/chat`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      // Try to get error details
      let errorDetails = '';
      try {
        const errorData = await response.json();
        errorDetails = errorData.detail || errorData.message || `Status: ${response.status}`;
      } catch (e) {
        console.error('Error parsing response JSON:', e);
        errorDetails = `Status: ${response.status}, Unable to parse error details`;
      }

      throw new Error(`Chat request failed: ${errorDetails}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    // Re-throw the error with more context
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(`Network error: Unable to reach the server. Please ensure the backend is running on ${baseUrl}. ${error.message}`);
    }

    throw error;
  }
}