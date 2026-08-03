'use client'

import { useState, useEffect, useCallback } from 'react'
import { Command } from 'cmdk'
import { Modal } from '@/shared/components/Modal/Modal'
import { useNavigate } from 'react-router'
import { useBoardContext } from '@/features/board/context/BoardContext'

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const { boards } = useBoardContext()

  const handleClose = useCallback(() => {
    onClose()
    setSearch('')
  }, [onClose])

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') handleClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, handleClose])

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-md">
      <Command
        value={search}
        onValueChange={setSearch}
        className="rounded-lg border border-border"
      >
        <div className="flex items-center border-b border-border px-3">
          <span className="text-muted-foreground mr-2">🔍</span>
          <Command.Input
            placeholder="Buscar tableros..."
            className="flex-1 py-3 text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
            autoFocus
          />
        </div>

        <Command.List className="max-h-64 overflow-auto p-2">
          <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
            No se encontraron tableros.
          </Command.Empty>

          {boards.map(board => (
            <Command.Item
              key={board.id}
              value={board.title}
              onSelect={() => {
                navigate(`/board/${board.id}`)
                handleClose()
              }}
              className="flex items-center gap-2 px-2 py-2 text-sm rounded-md cursor-pointer text-foreground hover:bg-surface-hover data-[selected=true]:bg-surface-hover transition-colors"
            >
              <span>{board.icon}</span>
              <span>{board.title}</span>
            </Command.Item>
          ))}
        </Command.List>

        <div className="border-t border-border px-3 py-2 text-xs text-muted-foreground">
          <span className="mr-2">💡</span>
          Usa ↑↓ para navegar, Enter para seleccionar
        </div>
      </Command>
    </Modal>
  )
}
