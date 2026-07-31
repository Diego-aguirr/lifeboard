import { useParams, Link } from 'react-router'
import { storage } from '@/shared/storage/StorageService'
import { boardsSchema } from '@/shared/validations/board.schema'
import { useBoard } from './hooks/useBoard'
import { BoardHeader } from './components/BoardHeader'
import { ColumnList } from './components/ColumnList'
import type { Board } from './types'

function loadBoardFromStorage(boardId: string): Board | null {
  const raw = storage.get<unknown>('boards')
  if (raw === null) return null

  const result = boardsSchema.safeParse(raw)
  if (!result.success) return null

  const boards = result.data as Board[]
  return boards.find(b => b.id === boardId) ?? null
}

export default function BoardPage() {
  const { boardId } = useParams<{ boardId: string }>()
  const boardFromStorage = boardId ? loadBoardFromStorage(boardId) : null

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
  } = useBoard(boardFromStorage)

  return (
    <div className="flex flex-col h-full">
      <BoardHeader icon={board.icon} title={board.title} color={board.color} />

      <ColumnList
        columns={columns}
        onAddColumn={addColumn}
        onRenameColumn={renameColumn}
        onDeleteColumn={deleteColumn}
        onMoveColumn={moveColumn}
        onAddCard={addCard}
        onRenameCard={renameCard}
        onDeleteCard={deleteCard}
      />
    </div>
  )
}
