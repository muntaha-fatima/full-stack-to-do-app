// Chat-related types shared between frontend and backend

export interface ChatMessage {
  id: number;
  userId: string;
  conversationId: number;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string; // ISO date string
}

export interface Conversation {
  id: number;
  userId: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface ChatRequest {
  message: string;
  conversationId?: number;
}

export interface ChatResponse {
  conversationId: number;
  response: string;
  toolCalls?: Array<{
    name: string;
    arguments: Record<string, any>;
  }>;
}