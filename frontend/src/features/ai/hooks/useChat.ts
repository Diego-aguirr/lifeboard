import { useState, useCallback, useRef } from 'react';
import { aiService, type ChatMessage, type BoardResponse } from '../services/aiService';
import { validateBoardTopic } from '../utils/topicValidator';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

interface UseChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (message: string) => Promise<void>;
  generateBoard: (message: string, onBoardCreated?: (board: BoardResponse & { id?: string }) => void) => Promise<BoardResponse | null>;
  clearMessages: () => void;
  clearError: () => void;
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const historyRef = useRef<ChatMessage[]>([]);

  const sendMessage = useCallback(async (message: string) => {
    const userMessage: ChatMessage = { role: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);
    historyRef.current = [...historyRef.current, userMessage];
    setIsLoading(true);
    setError(null);

    try {
      // Validate topic before sending to AI
      const validation = validateBoardTopic(message);
      if (!validation.isValid) {
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: validation.suggestion || 'Solo puedo ayudarte con temas relacionados a tableros Kanban y productividad personal.'
        };
        setMessages(prev => [...prev, assistantMessage]);
        historyRef.current = [...historyRef.current, assistantMessage];
        return;
      }

      const response = await aiService.chat(message, historyRef.current);
      const assistantMessage: ChatMessage = { role: 'assistant', content: response };
      setMessages(prev => [...prev, assistantMessage]);
      historyRef.current = [...historyRef.current, assistantMessage];
    } catch (err) {
      setError(aiService.getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createBoard = useCallback(async (board: BoardResponse) => {
    const res = await fetch(`${API_BASE}/boards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: board.title,
        icon: board.icon,
        color: board.color,
        columns: board.columns?.map((col, i) => ({
          title: col.title,
          order: i,
          cards: col.cards.map((card, j) => ({
            title: card.title,
            description: card.description,
            priority: card.priority,
            order: j,
          })),
        })),
      }),
    });

    if (!res.ok) {
      throw new Error('No se pudo guardar el tablero');
    }

    return res.json();
  }, []);

  const generateBoard = useCallback(async (message: string, onBoardCreated?: (board: BoardResponse & { id?: string }) => void): Promise<BoardResponse | null> => {
    const userMessage: ChatMessage = { role: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);
    historyRef.current = [...historyRef.current, userMessage];
    setIsLoading(true);
    setError(null);

    try {
      // Validate topic before sending to AI
      const validation = validateBoardTopic(message);
      if (!validation.isValid) {
        // Remove loading message if exists
        setMessages(prev => prev.slice(0, -1));
        
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: validation.suggestion || 'Solo puedo ayudarte con temas relacionados a tableros Kanban y productividad personal.'
        };
        setMessages(prev => [...prev, assistantMessage]);
        historyRef.current = [...historyRef.current, assistantMessage];
        return null;
      }

      // Show loading message
      const loadingMessage: ChatMessage = {
        role: 'assistant',
        content: '⏳ Pensando...',
      };
      setMessages(prev => [...prev, loadingMessage]);

      const board = await aiService.generateBoard(message, historyRef.current);

      // Remove loading message
      setMessages(prev => prev.slice(0, -1));

      if (board.action === 'create_board' && board.title) {
        // Create the board in the database and get the ID
        const result = await createBoard(board);
        const boardId = result?.data?.id;

        // Notify parent component with board data including ID
        if (onBoardCreated) {
          onBoardCreated({ ...board, id: boardId });
        }

        const confirmation: ChatMessage = {
          role: 'assistant',
          content: `¡Listo! Creé tu tablero "${board.title}" ${board.icon}\n\nRedirigiendo al tablero...`,
        };
        setMessages(prev => [...prev, confirmation]);
        historyRef.current = [...historyRef.current, confirmation];
      } else {
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: board.message || '¿En qué te puedo ayudar?',
        };
        setMessages(prev => [...prev, assistantMessage]);
        historyRef.current = [...historyRef.current, assistantMessage];
      }

      return board;
    } catch (err) {
      // Remove loading message on error
      setMessages(prev => prev.slice(0, -1));
      setError(aiService.getErrorMessage(err));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [createBoard]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    historyRef.current = [];
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    generateBoard,
    clearMessages,
    clearError,
  };
}
