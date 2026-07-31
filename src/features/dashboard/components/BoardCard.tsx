import type { Board } from '@/features/board/types'

interface BoardCardProps {
  board: Board
  onClick: () => void
  onDelete: (id: string) => void
}

export function BoardCard({ board, onClick, onDelete }: BoardCardProps) {
  return (
    <div
      className="rounded-lg border border-border bg-surface p-4 cursor-pointer hover:opacity-90 transition-opacity"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{board.icon}</span>
          <h3 className="font-medium text-foreground">{board.title}</h3>
        </div>
        <button
          className="text-sm text-muted-foreground hover:text-danger transition-colors"
          onClick={e => {
            e.stopPropagation()
            onDelete(board.id)
          }}
          aria-label="Eliminar tablero"
        >
          ✕
        </button>
      </div>
      <div
        className="mt-3 h-1.5 rounded-full"
        style={{ backgroundColor: board.color }}
      />
    </div>
  )
}
