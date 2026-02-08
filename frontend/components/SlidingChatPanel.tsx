'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatInterface } from '@/components/chat-interface';
import { sendChatMessage } from '@/lib/chat-api';
import { getUser } from '@/lib/auth';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export default function SlidingChatPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);

  // Get the active user on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUser();
        if (user) {
          setActiveUserId(user.id);
          
          // Load conversation history from localStorage
          const savedMessages = localStorage.getItem(`chat_${user.id}_messages`);
          if (savedMessages) {
            try {
              setMessages(JSON.parse(savedMessages));
            } catch (e) {
              console.error('Error parsing saved messages:', e);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    if (isOpen) {
      fetchUser();
    }
  }, [isOpen]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (activeUserId) {
      localStorage.setItem(`chat_${activeUserId}_messages`, JSON.stringify(messages));
    }
  }, [messages, activeUserId]);

  const handleSendMessage = async (message: string) => {
    // Get the current user to ensure they're authenticated
    const currentUser = await getUser();

    if (!currentUser || !currentUser.id) {
      console.error('No authenticated user found');
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant' as const,
        content: 'You must be logged in to use the chat feature. Please log in first.',
        createdAt: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }

    // Use the actual user ID from the authenticated user
    const userId = currentUser.id;
    console.log('Using user ID for chat:', userId);

    // Add user message to the list
    const userMessage = {
      id: Date.now(),
      role: 'user' as const,
      content: message,
      createdAt: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);

    setIsLoading(true);

    try {
      // Call the backend API
      const response = await sendChatMessage(userId, { message });

      // Add assistant response to the list
      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant' as const,
        content: response.response,
        createdAt: new Date().toISOString(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);

      // Add error message to the list
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant' as const,
        content: `Sorry, I encountered an error processing your request: ${error instanceof Error ? error.message : 'Unknown error'}`,
        createdAt: new Date().toISOString(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-16 h-16 p-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 border-2 border-white"
          aria-label="Open chat"
        >
          <MessageCircle className="h-7 w-7" />
        </Button>
      </div>

      {/* Sliding Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-pink-50 to-purple-50">
              <h2 className="text-lg font-semibold text-gray-800">Todo Chat Assistant</h2>
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="sm"
                className="rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-gray-100">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                          : 'bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200'
                      }`}
                    >
                      <div className="prose prose-sm max-w-none">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                      <p className={`text-xs mt-1 ${msg.role === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-lg px-4 py-2 bg-white border border-gray-200 flex items-center">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-pink-50 to-purple-50">
              <ChatInterface onSendMessage={handleSendMessage} messages={messages} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}