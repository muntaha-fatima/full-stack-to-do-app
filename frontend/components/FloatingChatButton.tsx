'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';

export default function FloatingChatButton() {
  const [isVisible, setIsVisible] = useState(true);
  const pathname = usePathname();

  // Hide the button on the chat page itself
  useEffect(() => {
    setIsVisible(pathname !== '/chat');
  }, [pathname]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Link href="/chat">
        <Button
          className="rounded-full w-14 h-14 p-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
          aria-label="Open chat"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </Link>
    </div>
  );
}