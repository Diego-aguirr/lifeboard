import { useState } from 'react'
import { useParams, Link } from 'react-router'
import { useBoardContext } from './context/BoardContext'
import { useBoard } from './hooks/useBoard'
import { BoardHeader } from './components/BoardHeader'
import { ColumnList } from './components/ColumnList'
import { CommandPalette } from '@/shared/components/CommandPalette/CommandPalette'
import { useKeyboardShortcuts } from '@/shared/hooks/useKeyboardShortcuts'

export default function BoardPage() {
  const { boardId } = useParams<{ boardId: string }>()
  const { getBoardById, updateBoard, loading } = useBoardContext()
  const boardFromStorage = boardId ? getBoardById(boardId) : undefined
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

  if (!boardFromStorage) {
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

  const {
    board,
    columns,
    addColumn,
    renameColumn,
    deleteColumn,
    moveColumn,
    addCard,
    renameCard,
    deleteCard,
    moveCard,
    updateCard,
  } = useBoard(boardFromStorage, { onUpdateBoard: updateBoard })

  return (
    <div className="flex flex-col h-full">
      <BoardHeader icon={board.icon} title={board.title} color={board.color} />

      <ColumnList
        boardId={board.id}
        columns={columns}
        onAddColumn={addColumn}
        onRenameColumn={renameColumn}
        onDeleteColumn={deleteColumn}
        onMoveColumn={moveColumn}
        onAddCard={addCard}
        onRenameCard={renameCard}
        onDeleteCard={deleteCard}
        onMoveCard={moveCard}
        onUpdateCard={(cardId, updates) => updateCard(board.id, cardId, updates)}
      />

      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
      />
    </div>
  )
}
