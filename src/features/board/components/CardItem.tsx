import { useState } from 'react'

interface CardItemProps {
  title: string
  onRename: (title: string) => void
  onDelete: () => void
}

export function CardItem({ title, onRename, onDelete }: CardItemProps) {
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
    <div className="group flex items-center justify-between gap-2 p-2 rounded-md bg-surface border border-border hover:opacity-90 transition-opacity">
      {isEditing ? (
        <input
          className="flex-1 text-sm bg-transparent outline-none text-foreground"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={handleSubmit}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      ) : (
        <span
          className="flex-1 text-sm text-foreground cursor-pointer"
          onDoubleClick={() => setIsEditing(true)}
        >
          {title}
        </span>
      )}

      <button
        className="text-xs text-muted-foreground hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => {
          if (window.confirm(`¿Eliminar tarjeta "${title}"?`)) {
            onDelete()
          }
        }}
        aria-label="Eliminar tarjeta"
      >
        ✕
      </button>
    </div>
  )
}
