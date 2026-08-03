import { useEffect } from 'react'
import type { Achievement } from '@/shared/hooks/useAchievements'

interface AchievementNotificationProps {
  achievement: Achievement | null
  onDismiss: () => void
}

export function AchievementNotification({ achievement, onDismiss }: AchievementNotificationProps) {
  useEffect(() => {
    if (achievement) {
      const timer = setTimeout(onDismiss, 4000)
      return () => clearTimeout(timer)
    }
  }, [achievement, onDismiss])

  if (!achievement) return null

  return (
    <div
      className="fixed bottom-6 right-6 z-50 animate-slide-up"
      role="alert"
      aria-live="polite"
    >
      <div className="bg-surface border border-border rounded-xl p-4 shadow-2xl flex items-center gap-4 max-w-sm">
        <span className="text-3xl" aria-hidden="true">{achievement.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">¡Logro desbloqueado!</p>
          <p className="text-sm text-primary font-medium truncate">{achievement.title}</p>
          <p className="text-xs text-muted-foreground truncate">{achievement.description}</p>
        </div>
        <button
          onClick={onDismiss}
          className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
          aria-label="Cerrar notificación"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
