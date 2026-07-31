import { useState, useRef, useEffect } from 'react'
import type { Card } from '../types'

interface CardItemProps {
  card: Card
  canMoveLeft: boolean
  canMoveRight: boolean
  onRename: (title: string) => void
  onDelete: () => void
  onMove: (direction: 'left' | 'right') => void
  onOpenDetail: () => void
}

export function CardItem({
  card,
  canMoveLeft,
  canMoveRight,
  onRename,
  onDelete,
  onMove,
  onOpenDetail,
}: CardItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(card.title)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [isEditing])

  function handleSubmit() {
    const trimmed = draft.trim()
    if (trimmed && trimmed !== card.title) {
      onRename(trimmed)
    } else {
      setDraft(card.title)
    }
    setIsEditing(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleSubmit()
    if (e.key === 'Escape') {
      setDraft(card.title)
      setIsEditing(false)
    }
  }

  const completedCount = card.checklist.filter(i => i.completed).length
  const hasChecklist = card.checklist.length > 0
  const hasTags = card.tags.length > 0

  return (
    <div
      className="group flex flex-col gap-1 p-2 rounded-md bg-surface border border-border hover:border-primary/30 transition-colors cursor-pointer"
      role="listitem"
      onClick={onOpenDetail}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpenDetail()
        }
      }}
      tabIndex={0}
      aria-label={`Tarjeta: ${card.title}`}
    >
      {/* Title */}
      {isEditing ? (
        <input
          ref={inputRef}
          className="flex-1 text-sm bg-transparent outline-none text-foreground min-w-0"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={handleSubmit}
          onKeyDown={handleKeyDown}
          onClick={e => e.stopPropagation()}
          aria-label="Editar nombre de tarjeta"
        />
      ) : (
        <span
          className="flex-1 text-sm text-foreground truncate"
          onDoubleClick={e => {
            e.stopPropagation()
            setIsEditing(true)
          }}
        >
          {card.title}
        </span>
      )}

      {/* Tags */}
      {hasTags && (
        <div className="flex flex-wrap gap-1">
          {card.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="px-1.5 py-0.5 text-[10px] font-medium bg-primary/10 text-primary rounded"
            >
              {tag}
            </span>
          ))}
          {card.tags.length > 3 && (
            <span className="text-[10px] text-muted-foreground">
              +{card.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Bottom row: progress + actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Priority indicator */}
          <span
            className={`w-2 h-2 rounded-full ${
              card.priority === 'high' ? 'bg-danger' :
              card.priority === 'medium' ? 'bg-warning' :
              'bg-success'
            }`}
            title={`Prioridad: ${card.priority}`}
          />

          {/* Checklist progress */}
          {hasChecklist && (
            <span className="text-[10px] text-muted-foreground" title={`${completedCount}/${card.checklist.length} completados`}>
              ✓ {completedCount}/{card.checklist.length}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            className="p-1 text-xs text-muted-foreground hover:text-foreground rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            onClick={e => {
              e.stopPropagation()
              onMove('left')
            }}
            disabled={!canMoveLeft}
            aria-label="Mover tarjeta a la izquierda"
            title="Mover a columna anterior"
          >
            ◀
          </button>
          <button
            className="p-1 text-xs text-muted-foreground hover:text-foreground rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            onClick={e => {
              e.stopPropagation()
              onMove('right')
            }}
            disabled={!canMoveRight}
            aria-label="Mover tarjeta a la derecha"
            title="Mover a columna siguiente"
          >
            ▶
          </button>
          <button
            className="p-1 text-xs text-muted-foreground hover:text-danger rounded transition-colors"
            onClick={e => {
              e.stopPropagation()
              if (window.confirm(`¿Eliminar tarjeta "${card.title}"?`)) {
                onDelete()
              }
            }}
            aria-label={`Eliminar tarjeta ${card.title}`}
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}
