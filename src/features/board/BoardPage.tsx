import { useParams } from 'react-router'
import { useBoard } from './hooks/useBoard'
import { BoardHeader } from './components/BoardHeader'
import { ColumnList } from './components/ColumnList'

// Tablero de ejemplo para ver la UI funcionando
const DEMO_BOARD = {
  id: 'demo-1',
  title: 'Aprender React',
  icon: '⚛️',
  color: '#61dafb',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  columns: [
    {
      id: 'col-1',
      title: 'Por aprender',
      order: 0,
      cards: [
        {
          id: 'card-1',
          title: 'Components y Props',
          description: '',
          priority: 'high' as const,
          tags: [],
          checklist: [],
          progress: 0,
          timeSpent: 0,
          startDate: null,
          targetDate: null,
          difficulty: 'easy' as const,
          order: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'card-2',
          title: 'useState y useEffect',
          description: '',
          priority: 'high' as const,
          tags: [],
          checklist: [],
          progress: 0,
          timeSpent: 0,
          startDate: null,
          targetDate: null,
          difficulty: 'medium' as const,
          order: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    },
    {
      id: 'col-2',
      title: 'Estudiando',
      order: 1,
      cards: [
        {
          id: 'card-3',
          title: 'Custom Hooks',
          description: '',
          priority: 'medium' as const,
          tags: [],
          checklist: [],
          progress: 30,
          timeSpent: 45,
          startDate: new Date().toISOString(),
          targetDate: null,
          difficulty: 'medium' as const,
          order: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    },
    {
      id: 'col-3',
      title: 'Dominado',
      order: 2,
      cards: [],
    },
  ],
}

export default function BoardPage() {
  const { boardId: _boardId } = useParams<{ boardId: string }>()
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
  } = useBoard(DEMO_BOARD)

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
