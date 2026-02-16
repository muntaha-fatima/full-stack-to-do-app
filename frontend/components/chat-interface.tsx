import { useState, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';

interface ChatInterfaceProps {
  onSendMessage: (message: string) => void;
}

export function ChatInterface({ onSendMessage }: ChatInterfaceProps) {
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
          placeholder="Type your message here..."
          className="resize-none flex-1"
          rows={1}
          onKeyDown={handleKeyDown}
        />
      </form>
    </div>
  );
}