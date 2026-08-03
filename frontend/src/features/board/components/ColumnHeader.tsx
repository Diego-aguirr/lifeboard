import { useState, useRef, useEffect, type HTMLAttributes } from 'react'
import { ConfirmDialog } from '@/shared/components/ConfirmDialog/ConfirmDialog'

interface ColumnHeaderProps {
  title: string
  isFirst: boolean
  isLast: boolean
  onRename: (title: string) => void
  onDelete: () => void
  onMove: (direction: 'left' | 'right') => void
  dragHandleProps?: HTMLAttributes<HTMLDivElement>
}

export function ColumnHeader({
  title,
  isFirst,
  isLast,
  onRename,
  onDelete,
  onMove,
  dragHandleProps,
}: ColumnHeaderProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(title)
  const [showConfirm, setShowConfirm] = useState(false)
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
    <>
      <div className="flex items-center justify-between gap-2 mb-3">
        {isEditing ? (
          <input
            ref={inputRef}
            className="flex-1 text-sm font-medium bg-transparent border-b border-primary outline-none text-foreground"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onBlur={handleSubmit}
            onKeyDown={handleKeyDown}
            aria-label="Editar nombre de columna"
          />
        ) : (
          <h3
            className="flex-1 text-sm font-medium text-foreground cursor-grab active:cursor-grabbing hover:text-primary truncate transition-colors"
            onDoubleClick={() => setIsEditing(true)}
            title={title}
            {...dragHandleProps}
          >
            {title}
          </h3>
        )}

        <div className="flex items-center gap-0.5">
          <button
            className="p-1 text-xs text-muted-foreground hover:text-foreground rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            onClick={() => onMove('left')}
            disabled={isFirst}
            aria-label="Mover columna a la izquierda"
            title="Mover columna izquierda"
          >
            ←
          </button>
          <button
            className="p-1 text-xs text-muted-foreground hover:text-foreground rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            onClick={() => onMove('right')}
            disabled={isLast}
            aria-label="Mover columna a la derecha"
            title="Mover columna derecha"
          >
            →
          </button>
          <button
            className="p-1 text-xs text-muted-foreground hover:text-danger rounded transition-colors"
            onClick={() => setShowConfirm(true)}
            aria-label={`Eliminar columna ${title}`}
            title="Eliminar columna"
          >
            ✕
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        title="Eliminar columna"
        message={`¿Estás seguro que querés eliminar la columna "${title}"? Todas las tarjetas se perderán.`}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        variant="danger"
        onConfirm={() => {
          setShowConfirm(false)
          onDelete()
        }}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  )
}
