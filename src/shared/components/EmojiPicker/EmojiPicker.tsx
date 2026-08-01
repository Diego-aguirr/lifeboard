import { useState, useRef, useEffect } from 'react'

interface EmojiPickerProps {
  value: string
  onChange: (emoji: string) => void
}

const EMOJI_CATEGORIES = [
  {
    name: 'Trabajo',
    emojis: ['📋', '📊', '📈', '📉', '💼', '📝', '📎', '📌', '🗂️', '📁']
  },
  {
    name: 'Estudio',
    emojis: ['📚', '📖', '📕', '📗', '📘', '📙', '🎓', '🔬', '🧪', '💡']
  },
  {
    name: 'Proyectos',
    emojis: ['🚀', '🎯', '⭐', '🏆', '🔥', '💎', '🎨', '🛠️', '⚙️', '🔧']
  },
  {
    name: 'Personal',
    emojis: ['🏠', '🏋️', '🎵', '🎮', '🍳', '🌱', '🧘', '✈️', '📸', '🎨']
  },
  {
    name: 'Ideas',
    emojis: ['💡', '🧠', '💭', '✨', '🌟', '💫', '🔮', '🎪', '🎭', '🎬']
  }
]

export function EmojiPicker({ value, onChange }: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredCategories = search
    ? EMOJI_CATEGORIES.map(cat => ({
        ...cat,
        emojis: cat.emojis.filter(() => cat.name.toLowerCase().includes(search.toLowerCase()))
      })).filter(cat => cat.emojis.length > 0)
    : EMOJI_CATEGORIES

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm bg-surface border border-border rounded-lg hover:border-primary/30 transition-colors"
        aria-label="Seleccionar emoji"
        aria-expanded={isOpen}
      >
        <span className="text-xl">{value}</span>
        <span className="text-muted-foreground">▼</span>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-64 bg-surface border border-border rounded-lg shadow-lg">
          {/* Search */}
          <div className="p-2 border-b border-border">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar emoji..."
              className="w-full px-3 py-1.5 text-sm bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
              autoFocus
            />
          </div>

          {/* Emoji grid */}
          <div className="p-2 max-h-48 overflow-y-auto">
            {filteredCategories.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-2">
                No se encontraron emojis
              </p>
            ) : (
              filteredCategories.map(category => (
                <div key={category.name} className="mb-2">
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    {category.name}
                  </p>
                  <div className="grid grid-cols-5 gap-1">
                    {category.emojis.map(emoji => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => {
                          onChange(emoji)
                          setIsOpen(false)
                          setSearch('')
                        }}
                        className={`p-1.5 text-lg rounded-md hover:bg-primary/10 transition-colors ${
                          value === emoji ? 'bg-primary/20 ring-1 ring-primary' : ''
                        }`}
                        aria-label={`Emoji: ${emoji}`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}