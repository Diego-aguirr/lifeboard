import type { Board } from '@/features/board/types'
import { calculateBoardProgress, getBoardStats } from '@/features/board/utils/boardStats'

interface BoardCardProps {
  board: Board
  onClick: () => void
  onDelete: (id: string) => void
}

export function BoardCard({ board, onClick, onDelete }: BoardCardProps) {
  const progress = calculateBoardProgress(board)
  const stats = getBoardStats(board)

  return (
    <div
      className="rounded-lg border border-border bg-surface p-4 cursor-pointer hover:border-primary/30 hover:shadow-md transition-all"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
      aria-label={`Tablero: ${board.title}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden="true">{board.icon}</span>
          <h3 className="font-medium text-foreground">{board.title}</h3>
        </div>
        <button
          className="p-1 text-sm text-muted-foreground hover:text-danger rounded-md hover:bg-surface-hover transition-colors"
          onClick={e => {
            e.stopPropagation()
            onDelete(board.id)
          }}
          aria-label={`Eliminar tablero ${board.title}`}
        >
          ✕
        </button>
      </div>

      {/* Stats */}
      <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
        <span>{stats.totalColumns} columnas</span>
        <span>·</span>
        <span>{stats.totalCards} tarjetas</span>
      </div>

      {/* Progress bar */}
      <div className="mt-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-muted-foreground">Progreso</span>
          <span className="text-xs text-muted-foreground">{progress}%</span>
        </div>
        <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${progress}%`,
              backgroundColor: board.color,
            }}
          />
        </div>
      </div>
    </div>
  )
}
