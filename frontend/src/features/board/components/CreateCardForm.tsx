import { useState } from 'react'

interface CreateCardFormProps {
  onCreate: (title: string) => void
}

export function CreateCardForm({ onCreate }: CreateCardFormProps) {
  const [title, setTitle] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    onCreate(trimmed)
    setTitle('')
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      setTitle('')
      setIsExpanded(false)
    }
  }

  if (!isExpanded) {
    return (
      <button
        className="w-full py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/80 rounded-md transition-colors text-left"
        onClick={() => setIsExpanded(true)}
        aria-label="Agregar nueva tarjeta"
      >
        + Agregar tarjeta
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        className="w-full px-3 py-2 text-sm bg-surface border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
        placeholder="Título de la tarjeta"
        value={title}
        onChange={e => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
        aria-label="Título de la nueva tarjeta"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
        >
          Agregar
        </button>
        <button
          type="button"
          className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-secondary/80 transition-colors"
          onClick={() => {
            setTitle('')
            setIsExpanded(false)
          }}
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
