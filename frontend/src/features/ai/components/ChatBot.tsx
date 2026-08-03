import { useState } from 'react';
import { ChatPanel } from './ChatPanel';
import type { Router } from 'react-router';

interface ChatBotProps {
  router?: Router;
}

export function ChatBot({ router }: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigateToBoard = () => {
    setIsOpen(false);
    if (router) {
      router.navigate('/');
    } else {
      window.location.href = '/';
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          isOpen
            ? 'bg-muted rotate-90'
            : 'bg-primary hover:bg-primary/90 hover:scale-110'
        }`}
        aria-label={isOpen ? 'Cerrar chat' : 'Abrir asistente'}
      >
        {isOpen ? (
          <span className="text-xl text-primary-foreground">✕</span>
        ) : (
          <span className="text-xl">💬</span>
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <ChatPanel
          onClose={() => setIsOpen(false)}
          onNavigateToBoard={handleNavigateToBoard}
        />
      )}
    </>
  );
}
