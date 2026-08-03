import { useState } from 'react'
import { useParams, Link } from 'react-router'
import { useBoardContext } from './context/BoardContext'
import { BoardHeader } from './components/BoardHeader'
import { ColumnList } from './components/ColumnList'
import { CommandPalette } from '@/shared/components/CommandPalette/CommandPalette'
import { useKeyboardShortcuts } from '@/shared/hooks/useKeyboardShortcuts'

export default function BoardPage() {
  const { boardId } = useParams<{ boardId: string }>()
  const {
    getBoardById,
    loading,
    addColumn,
    renameColumn,
    deleteColumn,
    moveColumn,
    addCard,
    renameCard,
    deleteCard,
    moveCard,
    updateCard,
  } = useBoardContext()
  const board = boardId ? getBoardById(boardId) : undefined
  const [showCommandPalette, setShowCommandPalette] = useState(false)

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onCommandPalette: () => setShowCommandPalette(true),
    onEscape: () => setShowCommandPalette(false),
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    )
  }

  if (!board) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-muted-foreground">Tablero no encontrado</p>
        <Link
          to="/"
          className="text-primary hover:underline"
        >
          Volver al Dashboard
        </Link>
      </div>
    )
  }

  const columns = [...board.columns].sort((a, b) => a.order - b.order)

  return (
    <div className="flex flex-col h-full">
      <BoardHeader icon={board.icon} title={board.title} color={board.color} />

      <ColumnList
        boardId={board.id}
        columns={columns}
        onAddColumn={title => addColumn(board.id, title)}
        onRenameColumn={(columnId, title) => renameColumn(board.id, columnId, title)}
        onDeleteColumn={columnId => deleteColumn(board.id, columnId)}
        onMoveColumn={(columnId, direction) => moveColumn(board.id, columnId, direction)}
        onAddCard={(columnId, title) => addCard(board.id, columnId, title)}
        onRenameCard={(columnId, cardId, title) => renameCard(board.id, columnId, cardId, title)}
        onDeleteCard={(columnId, cardId) => deleteCard(board.id, columnId, cardId)}
        onMoveCard={(cardId, direction) => moveCard(board.id, cardId, direction)}
        onUpdateCard={(cardId, updates) => updateCard(board.id, cardId, updates)}
      />

      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
      />
    </div>
  )
}