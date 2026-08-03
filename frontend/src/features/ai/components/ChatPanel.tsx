import { useState, useRef, useEffect } from 'react';
import { useChat } from '../hooks/useChat';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { useBoardContext } from '@/features/board/context/BoardContext';
import type { BoardResponse } from '../services/aiService';

interface ChatPanelProps {
  onClose: () => void;
  onNavigateToBoard?: () => void;
}

export function ChatPanel({ onClose, onNavigateToBoard }: ChatPanelProps) {
  const { messages, isLoading, error, sendMessage, generateBoard, clearError } = useChat();
  const { createBoard: addBoardToContext } = useBoardContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0) {
      setShowWelcome(false);
    }
  }, [messages]);

  const handleSend = async (message: string) => {
    // Always try generateBoard — the backend decides if it's a board or chat
    await generateBoard(message, (board) => {
      if (board.action === 'create_board' && board.title && board.columns) {
        // Add board to context so it appears in dashboard
        addBoardToContext({
          title: board.title,
          icon: board.icon || '📋',
          color: board.color || '#3b82f6',
          columns: board.columns,
        });
        // Navigate to home after creation
        if (onNavigateToBoard) {
          setTimeout(() => {
            onNavigateToBoard();
          }, 1000);
        }
      }
    });
  };

  const quickActions = [
    { label: '📋 Crear tablero de estudio', message: 'Quiero crear un tablero para estudiar' },
    { label: '🏋️ Crear rutina de gym', message: 'Quiero crear una rutina de gimnasio' },
    { label: '💼 Crear tablero de proyecto', message: 'Quiero crear un tablero para un proyecto' },
  ];

  return (
    <div className="fixed bottom-24 right-6 z-50 w-[380px] h-[520px] bg-surface border border-border rounded-xl shadow-2xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-primary/10 border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🤖</span>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Asistente</h3>
            <p className="text-xs text-muted-foreground">LifeBoard AI</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Cerrar"
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {showWelcome && (
          <div className="text-center py-4">
            <div className="text-4xl mb-3">👋</div>
            <h4 className="font-medium text-foreground mb-1">¡Hola! Soy tu asistente</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Puedo ayudarte a crear tableros, rutinas y más.
            </p>
            <div className="space-y-2">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => handleSend(action.message)}
                  className="w-full text-left px-3 py-2 text-sm bg-muted/50 hover:bg-muted rounded-lg transition-colors"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}

        {isLoading && (
          <div className="flex items-start gap-2">
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-sm flex-shrink-0">
              🤖
            </div>
            <div className="bg-muted rounded-lg px-3 py-2 max-w-[80%]">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-xs">Pensando...</span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm text-destructive">
            <p>{error}</p>
            <button
              onClick={clearError}
              className="text-xs underline mt-1 hover:no-underline"
            >
              Cerrar
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput onSend={handleSend} disabled={isLoading} />
    </div>
  );
}
