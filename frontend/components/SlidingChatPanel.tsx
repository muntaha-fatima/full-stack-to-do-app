'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Send, Bot, User, Trash2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
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
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUser();
        if (user) {
          setActiveUserId(user.id);
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

  useEffect(() => {
    if (activeUserId) {
      localStorage.setItem(`chat_${activeUserId}_messages`, JSON.stringify(messages));
    }
  }, [messages, activeUserId]);

  const handleSendMessage = async (message: string) => {
    const currentUser = await getUser();

    if (!currentUser || !currentUser.id) {
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant' as const,
        content: 'You must be logged in to use the chat feature.',
        createdAt: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }

    const userId = currentUser.id;

    const userMessage = {
      id: Date.now(),
      role: 'user' as const,
      content: message,
      createdAt: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setInputValue('');

    try {
      const response = await sendChatMessage(userId, { message });

      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant' as const,
        content: response.response,
        createdAt: new Date().toISOString(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant' as const,
        content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        createdAt: new Date().toISOString(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    if (activeUserId) {
      localStorage.removeItem(`chat_${activeUserId}_messages`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      handleSendMessage(inputValue);
    }
  };

  return (
    <>
      <motion.div 
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.5 }}
      >
        <motion.button
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="relative group w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 flex items-center justify-center shadow-2xl border-2 border-white"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full blur-lg opacity-75 group-hover:opacity-100 animate-pulse" />
          <MessageCircle className="h-7 w-7 text-white relative z-10" />
          {messages.length === 0 && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-bounce" />
          )}
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-950 shadow-2xl z-50 flex flex-col"
            >
              <div className="flex items-center justify-between p-6 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Bot className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">AI Assistant</h2>
                    <p className="text-xs text-white/80">Powered by TodoApp</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleClearChat}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 rounded-full"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => setIsOpen(false)}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 rounded-full"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="px-6 py-3 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {messages.length === 0 ? 'Start a conversation' : `${messages.length} messages`}
                  </p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-600/20 flex items-center justify-center mb-6"
                    >
                      <Sparkles className="h-12 w-12 text-pink-500" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      Welcome to AI Chat
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-xs">
                      I can help you manage tasks, set reminders, and boost productivity
                    </p>
                    <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
                      {[
                        { label: 'Add Task', example: 'Add task: Buy groceries' },
                        { label: 'Show Tasks', example: 'Show my tasks' },
                        { label: 'Complete Task', example: 'Complete task 1' },
                        { label: 'Delete Task', example: 'Delete task 1' }
                      ].map((action, index) => (
                        <motion.button
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          onClick={() => handleSendMessage(action.example)}
                          className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-pink-500 transition-colors text-left"
                        >
                          <p className="text-sm font-semibold text-gray-800 dark:text-white">{action.label}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{action.example}</p>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg, index) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex items-end gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            msg.role === 'user' 
                              ? 'bg-gradient-to-br from-pink-500 to-purple-600' 
                              : 'bg-gradient-to-br from-cyan-500 to-blue-600'
                          }`}>
                            {msg.role === 'user' ? (
                              <User className="h-4 w-4 text-white" />
                            ) : (
                              <Bot className="h-4 w-4 text-white" />
                            )}
                          </div>
                          <div
                            className={`rounded-2xl px-4 py-3 ${
                              msg.role === 'user'
                                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200'
                            } shadow-sm`}
                          >
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                              <ReactMarkdown>{msg.content}</ReactMarkdown>
                            </div>
                            <p className={`text-xs mt-2 ${
                              msg.role === 'user' 
                                ? 'text-white/70' 
                                : 'text-gray-500 dark:text-gray-400'
                            }`}>
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                      >
                        <div className="flex items-end gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                            <Bot className="h-4 w-4 text-white" />
                          </div>
                          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>

              <div className="p-6 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
                <form onSubmit={handleSubmit} className="flex gap-3">
                  <div className="flex-1">
                    <Textarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Type your message..."
                      className="resize-none"
                      rows={1}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmit(e);
                        }
                      }}
                    />
                  </div>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <Send className="h-5 w-5 text-white" />
                  </motion.button>
                </form>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
                  AI-powered task management
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
