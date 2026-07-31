import { useState } from 'react'
import { Button } from '@/shared/components/Button/Button'

interface ColumnHeaderProps {
  title: string
  isFirst: boolean
  isLast: boolean
  onRename: (title: string) => void
  onDelete: () => void
  onMove: (direction: 'left' | 'right') => void
}

export function ColumnHeader({
  title,
  isFirst,
  isLast,
  onRename,
  onDelete,
  onMove,
}: ColumnHeaderProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(title)

  function handleSubmit() {
    const trimmed = draft.trim()
    if (trimmed && trimmed !== title) {
      onRename(trimmed)
    } else {
      setDraft(title)
    }
    setIsEditing(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleSubmit()
    if (e.key === 'Escape') {
      setDraft(title)
      setIsEditing(false)
    }
  }

  return (
    <div className="flex items-center justify-between gap-2 mb-3">
      {isEditing ? (
        <input
          className="flex-1 text-sm font-medium bg-transparent border-b border-border outline-none text-foreground"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={handleSubmit}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      ) : (
        <h3
          className="flex-1 text-sm font-medium text-foreground cursor-pointer hover:opacity-80"
          onDoubleClick={() => setIsEditing(true)}
        >
          {title}
        </h3>
      )}

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onMove('left')}
          disabled={isFirst}
          aria-label="Mover columna a la izquierda"
        >
          ←
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onMove('right')}
          disabled={isLast}
          aria-label="Mover columna a la derecha"
        >
          →
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (window.confirm(`¿Eliminar columna "${title}"?`)) {
              onDelete()
            }
          }}
          aria-label="Eliminar columna"
        >
          ✕
        </Button>
      </div>
    </div>
  )
}
