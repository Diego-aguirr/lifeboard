import { useEffect, useCallback } from 'react'

interface ShortcutHandlers {
  onNewCard?: () => void
  onSearch?: () => void
  onCommandPalette?: () => void
  onEscape?: () => void
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Ignore if typing in an input/textarea
      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        // Only handle Escape in inputs
        if (e.key === 'Escape' && handlers.onEscape) {
          handlers.onEscape()
        }
        return
      }

      // N - New card
      if (e.key === 'n' && !e.ctrlKey && !e.metaKey && handlers.onNewCard) {
        e.preventDefault()
        handlers.onNewCard()
      }

      // / - Search
      if (e.key === '/' && !e.ctrlKey && !e.metaKey && handlers.onSearch) {
        e.preventDefault()
        handlers.onSearch()
      }

      // Ctrl+K or Cmd+K - Command palette
      if ((e.ctrlKey || e.metaKey) && e.key === 'k' && handlers.onCommandPalette) {
        e.preventDefault()
        handlers.onCommandPalette()
      }

      // Escape
      if (e.key === 'Escape' && handlers.onEscape) {
        handlers.onEscape()
      }
    },
    [handlers]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}
