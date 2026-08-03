import type { ChatMessage } from '../services/aiService';

interface MessageBubbleProps {
  message: ChatMessage;
}

/**
 * Sanitize message content for display
 * Removes any potential code, JSON, or technical content
 */
function sanitizeForDisplay(text: string): string {
  if (!text) return '';
  
  let sanitized = text;
  
  // Remove code blocks
  sanitized = sanitized.replace(/```[\s\S]*?```/g, '');
  sanitized = sanitized.replace(/`[^`]*`/g, '');
  
  // Remove JSON-like content
  sanitized = sanitized.replace(/\{[\s\S]*?\}/g, '');
  
  // Remove technical markers
  sanitized = sanitized.replace(/^(json|JSON|code|CODE)\s*/gm, '');
  
  // Clean up extra whitespace
  sanitized = sanitized.replace(/\n{3,}/g, '\n\n');
  sanitized = sanitized.trim();
  
  // If empty after sanitization, return generic message
  if (!sanitized) {
    return '¿En qué te puedo ayudar?';
  }
  
  return sanitized;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  
  // Only sanitize assistant messages
  const displayContent = isUser ? message.content : sanitizeForDisplay(message.content);

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
          isUser
            ? 'bg-primary text-primary-foreground rounded-br-none'
            : 'bg-muted text-foreground rounded-bl-none'
        }`}
      >
        <p className="whitespace-pre-wrap">{displayContent}</p>
      </div>
    </div>
  );
}
