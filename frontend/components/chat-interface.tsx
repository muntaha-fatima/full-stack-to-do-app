import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

// Placeholder for OpenAI ChatKit - in a real implementation, this would be imported from @openai/chat-components
interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

interface ChatInterfaceProps {
  onSendMessage: (message: string) => void;
  messages?: ChatMessage[];
}

export function ChatInterface({ onSendMessage, messages = [] }: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  return (
    <div className="w-full">
      <form ref={formRef} onSubmit={handleSubmit} className="flex gap-2">
        <Textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message here... (e.g., 'Add task: Buy groceries')"
          className="resize-none"
          onKeyDown={handleKeyDown}
        />
        <Button type="submit" className="whitespace-nowrap">
          Send
        </Button>
      </form>

      {/* Preview of recent messages */}
      {messages.length > 0 && (
        <div className="mt-4 p-2 bg-gray-100 rounded-md max-h-32 overflow-y-auto">
          <p className="text-sm text-gray-600">Recent messages:</p>
          {messages.slice(-3).map((msg) => (
            <div key={msg.id} className={`text-xs p-1 ${msg.role === 'user' ? 'text-blue-600' : 'text-green-600'}`}>
              <span className="font-medium">{msg.role}: </span>
              {msg.content.substring(0, 50)}{msg.content.length > 50 ? '...' : ''}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}