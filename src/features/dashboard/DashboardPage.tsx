import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { useBoardContext } from '@/features/board/context/BoardContext'
import { BoardCard } from './components/BoardCard'
import { CreateBoardForm } from './components/CreateBoardForm'

export default function DashboardPage() {
  const { boards, createBoard, deleteBoard, loading } = useBoardContext()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const filteredBoards = useMemo(() => {
    if (!search.trim()) return boards
    const query = search.toLowerCase()
    return boards.filter(board =>
      board.title.toLowerCase().includes(query)
    )
  }, [boards, search])

  function handleCreate(title: string) {
    createBoard({ title, icon: '📋', color: '#3b82f6' })
  }

  function handleDelete(id: string) {
    if (window.confirm('¿Eliminar este tablero?')) {
      deleteBoard(id)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-foreground mb-6">Mis Tableros</h1>

      <CreateBoardForm onCreate={handleCreate} />

      {/* Search */}
      {boards.length > 0 && (
        <div className="mt-4">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              🔍
            </span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar tableros..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-surface border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              aria-label="Buscar tableros"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Limpiar búsqueda"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}

      {/* Board list */}
      {boards.length === 0 ? (
        <p className="mt-8 text-muted-foreground text-center">
          No hay tableros. Crea uno para empezar.
        </p>
      ) : filteredBoards.length === 0 ? (
        <p className="mt-8 text-muted-foreground text-center">
          No se encontraron tableros con "{search}"
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBoards.map(board => (
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
