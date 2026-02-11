import axios from 'axios';
import { ChatRequest, ChatResponse } from '../types/chat';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://shazsabir-to-do-backend.hf.space';

export const chatApi = {
  async sendMessage(userId: string, request: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await axios.post<ChatResponse>(
        `${API_BASE_URL}/api/v1/${userId}/chat`,
        request,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error sending chat message:', error);
      throw error;
    }
  },
};