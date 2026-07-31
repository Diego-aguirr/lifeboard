import { useState, useRef, useEffect } from 'react'

interface CardItemProps {
  title: string
  canMoveLeft: boolean
  canMoveRight: boolean
  onRename: (title: string) => void
  onDelete: () => void
  onMove: (direction: 'left' | 'right') => void
}

export function CardItem({
  title,
  canMoveLeft,
  canMoveRight,
  onRename,
  onDelete,
  onMove,
}: CardItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(title)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [isEditing])

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
    <div
      className="group flex items-center gap-1 p-2 rounded-md bg-surface border border-border hover:border-primary/30 transition-colors"
      role="listitem"
    >
      {isEditing ? (
        <input
          ref={inputRef}
          className="flex-1 text-sm bg-transparent outline-none text-foreground min-w-0"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={handleSubmit}
          onKeyDown={handleKeyDown}
          aria-label="Editar nombre de tarjeta"
        />
      ) : (
        <span
          className="flex-1 text-sm text-foreground cursor-pointer truncate"
          onDoubleClick={() => setIsEditing(true)}
          title={title}
        >
          {title}
        </span>
      )}

      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          className="p-1 text-xs text-muted-foreground hover:text-foreground rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          onClick={() => onMove('left')}
          disabled={!canMoveLeft}
          aria-label="Mover tarjeta a la izquierda"
          title="Mover a columna anterior"
        >
          ◀
        </button>
        <button
          className="p-1 text-xs text-muted-foreground hover:text-foreground rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          onClick={() => onMove('right')}
          disabled={!canMoveRight}
          aria-label="Mover tarjeta a la derecha"
          title="Mover a columna siguiente"
        >
          ▶
        </button>
        <button
          className="p-1 text-xs text-muted-foreground hover:text-danger rounded transition-colors"
          onClick={() => {
            if (window.confirm(`¿Eliminar tarjeta "${title}"?`)) {
              onDelete()
            }
          }}
          aria-label={`Eliminar tarjeta ${title}`}
        >
          ✕
        </button>
      </div>
    </div>
  )
}
