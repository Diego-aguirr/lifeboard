import { useNavigate } from 'react-router'
import { useBoards } from './hooks/useBoards'
import { BoardCard } from './components/BoardCard'
import { CreateBoardForm } from './components/CreateBoardForm'

export default function DashboardPage() {
  const { boards, createBoard, deleteBoard } = useBoards()
  const navigate = useNavigate()

  function handleCreate(title: string) {
    createBoard({ title, icon: '📋', color: '#3b82f6' })
  }

  function handleDelete(id: string) {
    if (window.confirm('¿Eliminar este tablero?')) {
      deleteBoard(id)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-foreground mb-6">Mis Tableros</h1>

      <CreateBoardForm onCreate={handleCreate} />

      {boards.length === 0 ? (
        <p className="mt-8 text-muted-foreground text-center">
          No hay tableros. Crea uno para empezar.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {boards.map(board => (
            <BoardCard
              key={board.id}
              board={board}
              onClick={() => navigate(`/board/${board.id}`)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
