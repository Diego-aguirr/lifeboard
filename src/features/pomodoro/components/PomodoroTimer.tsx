import { usePomodoro } from '../hooks/usePomodoro'

interface PomodoroTimerProps {
  onClose?: () => void
}

export function PomodoroTimer({ onClose }: PomodoroTimerProps) {
  const {
    mode,
    isRunning,
    sessionsCompleted,
    formattedTime,
    progress,
    start,
    pause,
    reset,
    skip,
  } = usePomodoro()

  return (
    <div className="bg-surface border border-border rounded-xl p-6 shadow-lg max-w-xs w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
          {mode === 'work' ? '🍅 Pomodoro' : '☕ Descanso'}
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Cerrar temporizador"
          >
            ✕
          </button>
        )}
      </div>

      {/* Timer circle */}
      <div className="relative flex items-center justify-center mb-6">
        <svg className="w-40 h-40 -rotate-90" viewBox="0 0 160 160">
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-border"
          />
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 70}
            strokeDashoffset={2 * Math.PI * 70 * (1 - progress / 100)}
            className={mode === 'work' ? 'text-red-500' : 'text-green-500'}
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <div className="absolute text-center">
          <p className="text-4xl font-mono font-bold text-foreground">
            {formattedTime}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Sesiones: {sessionsCompleted}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        {!isRunning ? (
          <button
            onClick={start}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Iniciar
          </button>
        ) : (
          <button
            onClick={pause}
            className="px-4 py-2 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors"
          >
            Pausar
          </button>
        )}
        <button
          onClick={skip}
          className="px-4 py-2 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors"
          aria-label="Saltar"
        >
          ⏭
        </button>
        <button
          onClick={reset}
          className="px-4 py-2 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors"
          aria-label="Reiniciar"
        >
          ↺
        </button>
      </div>
    </div>
  )
}
