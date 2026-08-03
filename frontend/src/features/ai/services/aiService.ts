const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface BoardResponse {
  action: 'create_board' | 'chat';
  title?: string;
  icon?: string;
  color?: string;
  columns?: Array<{
    title: string;
    cards: Array<{
      title: string;
      description: string;
      priority: 'low' | 'medium' | 'high';
    }>;
  }>;
  message?: string;
}

interface ApiError {
  status: string;
  code: string;
  message: string;
}

const ERROR_MESSAGES: Record<string, string> = {
  AI_NO_CONFIG: 'El asistente no está configurado. Pedile al administrador que agregue la API key.',
  AI_INVALID_KEY: 'La configuración de IA es incorrecta. Contactá al administrador.',
  AI_QUOTA: '⏳ El asistente está con mucha demanda. Esperá unos minutos y probá de nuevo.',
  AI_BLOCKED: '🚫 Tu mensaje fue filtrado por seguridad. Probá con otra cosa.',
  AI_NETWORK: '📡 No tenés conexión a internet. Verificá tu red.',
  AI_ERROR: '🤖 El asistente se confundió un momento. Probá de nuevo.',
  DEFAULT: 'Algo salió mal. Probá de nuevo en unos segundos.',
};

function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'code' in error) {
    const apiError = error as ApiError;
    return ERROR_MESSAGES[apiError.code] || apiError.message || ERROR_MESSAGES.DEFAULT;
  }
  if (error instanceof Error) {
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      return '📡 No se pudo conectar al servidor. Verificá que el backend esté corriendo.';
    }
    return ERROR_MESSAGES.DEFAULT;
  }
  return ERROR_MESSAGES.DEFAULT;
}

export const aiService = {
  chat: async (message: string, history: ChatMessage[]): Promise<string> => {
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history }),
    });

    const data = await res.json();

    if (!res.ok || data.status === 'error') {
      throw new Error(data.message || ERROR_MESSAGES.DEFAULT);
    }

    return data.data.response;
  },

  generateBoard: async (message: string, history: ChatMessage[]): Promise<BoardResponse> => {
    const res = await fetch(`${API_BASE}/ai/generate-board`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history }),
    });

    const data = await res.json();

    if (!res.ok || data.status === 'error') {
      throw new Error(data.message || ERROR_MESSAGES.DEFAULT);
    }

    return data.data;
  },

  getErrorMessage,
};
