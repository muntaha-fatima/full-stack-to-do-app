'use client';

import { useState, useCallback } from 'react';
import { chatApi } from '@/lib/chat';
import { ChatMessage } from '../../../../shared/types/chat';

export function useChat(userId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      // Add user message to the UI immediately
      const userMessage: ChatMessage = {
        id: Date.now(),
        userId,
        conversationId: 0, // Will be updated after API response
        role: 'user',
        content: message,
        createdAt: new Date().toISOString(),
      };

      setMessages(prev => [...prev, userMessage]);

      // Send message to backend
      const response = await chatApi.sendMessage(userId, {
        message,
        conversationId: messages.length > 0 ? messages[0].conversationId : undefined,
      });

      // Add assistant response to the UI
      const assistantMessage: ChatMessage = {
        id: Date.now() + 1,
        userId: 'assistant', // Or system ID
        conversationId: response.conversationId,
        role: 'assistant',
        content: response.response,
        createdAt: new Date().toISOString(),
      };

      setMessages(prev => {
        // Update the user message with the correct conversation ID
        const updatedPrev = prev.map(msg => 
          msg.id === userMessage.id ? { ...msg, conversationId: response.conversationId } : msg
        );
        return [...updatedPrev, assistantMessage];
      });
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
      
      // Show error in the chat as an assistant message
      const errorMessage: ChatMessage = {
        id: Date.now(),
        userId: 'assistant',
        conversationId: messages.length > 0 ? messages[0].conversationId : 0,
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        createdAt: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [userId, messages]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
  };
}