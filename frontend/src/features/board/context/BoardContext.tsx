import { createContext, useContext, useReducer, useEffect, useCallback, type ReactNode } from 'react'
import { storage } from '@/shared/storage/StorageService'
import { boardsSchema } from '@/shared/validations/board.schema'
import { debounce } from '@/lib/utils'
import { generateId } from '@/shared/utils/generateId'
import { DEMO_BOARDS } from '../data/demo-boards'
import type { Board, Column, Card } from '../types'

const STORAGE_KEY = 'boards'

// ─── State ─────────────────────────────────────────────

interface BoardState {
  boards: Board[]
  loading: boolean
}

const initialState: BoardState = {
  boards: [],
  loading: true,
}

// ─── Actions ───────────────────────────────────────────

type BoardAction =
  | { type: 'LOAD_BOARDS'; payload: Board[] }
  | { type: 'CREATE_BOARD'; payload: Board }
  | { type: 'DELETE_BOARD'; payload: string }
  | { type: 'UPDATE_BOARD'; payload: { id: string; updates: Partial<Board> } }
  | { type: 'UPDATE_CARD'; payload: { boardId: string; cardId: string; updates: Partial<Card> } }
  | { type: 'SET_BOARD'; payload: { id: string; board: Board } }

// ─── Reducer ───────────────────────────────────────────

function boardReducer(state: BoardState, action: BoardAction): BoardState {
  switch (action.type) {
    case 'LOAD_BOARDS':
      return { boards: action.payload, loading: false }

    case 'CREATE_BOARD':
      return { ...state, boards: [...state.boards, action.payload] }

    case 'DELETE_BOARD':
      return {
        ...state,
        boards: state.boards.filter(b => b.id !== action.payload),
      }

    case 'UPDATE_BOARD':
      return {
        ...state,
        boards: state.boards.map(b =>
          b.id === action.payload.id ? { ...b, ...action.payload.updates } : b
        ),
      }

    case 'UPDATE_CARD':
      return {
        ...state,
        boards: state.boards.map(b => {
          if (b.id !== action.payload.boardId) return b
          return {
            ...b,
            columns: b.columns.map(col => ({
              ...col,
              cards: col.cards.map(card =>
                card.id === action.payload.cardId
                  ? { ...card, ...action.payload.updates }
                  : card
              ),
            })),
          }
        }),
      }

    case 'SET_BOARD':
      return {
        ...state,
        boards: state.boards.map(b =>
          b.id === action.payload.id ? action.payload.board : b
        ),
      }

    default:
      return state
  }
}

// ─── Context ───────────────────────────────────────────

interface BoardContextValue {
  boards: Board[]
  loading: boolean
  createBoard: (input: { title: string; icon: string; color: string; columns?: Array<{ title: string; cards: Array<{ title: string; description: string; priority: 'low' | 'medium' | 'high' }> }> }) => void
  deleteBoard: (id: string) => void
  updateBoard: (id: string, updates: Partial<Board>) => void
  updateCard: (boardId: string, cardId: string, updates: Partial<Card>) => void
  getBoardById: (id: string) => Board | undefined
  addColumn: (boardId: string, title: string) => void
  renameColumn: (boardId: string, columnId: string, title: string) => void
  deleteColumn: (boardId: string, columnId: string) => void
  moveColumn: (boardId: string, columnId: string, direction: 'left' | 'right') => void
  addCard: (boardId: string, columnId: string, title: string) => void
  renameCard: (boardId: string, columnId: string, cardId: string, title: string) => void
  deleteCard: (boardId: string, columnId: string, cardId: string) => void
  moveCard: (boardId: string, cardId: string, direction: 'left' | 'right') => void
}

const BoardContext = createContext<BoardContextValue | null>(null)

// ─── Provider ──────────────────────────────────────────

export function BoardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(boardReducer, initialState)

  // Load boards from storage on mount
  useEffect(() => {
    const raw = storage.get<unknown>(STORAGE_KEY)
    if (raw === null) {
      // First visit: load demo data
      dispatch({ type: 'LOAD_BOARDS', payload: DEMO_BOARDS })
      return
    }

    const result = boardsSchema.safeParse(raw)
    if (!result.success) {
      console.warn('[BoardProvider] Invalid data in storage, resetting')
      dispatch({ type: 'LOAD_BOARDS', payload: DEMO_BOARDS })
      return
    }

    dispatch({ type: 'LOAD_BOARDS', payload: result.data as Board[] })
  }, [])

  // Debounced save to storage
  const saveToStorage = useCallback(
    debounce((boards: Board[]) => {
      storage.set(STORAGE_KEY, boards)
    }, 500),
    []
  )

  // Save on change
  useEffect(() => {
    if (!state.loading) {
      saveToStorage(state.boards)
    }
  }, [state.boards, state.loading, saveToStorage])

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      saveToStorage.cancel()
    }
  }, [saveToStorage])

  // ─── Actions ────────────────────────────────────────

  function createBoard(input: { title: string; icon: string; color: string; columns?: Array<{ title: string; cards: Array<{ title: string; description: string; priority: 'low' | 'medium' | 'high' }> }> }) {
    const now = new Date().toISOString()
    const newBoard: Board = {
      id: crypto.randomUUID(),
      title: input.title,
      icon: input.icon,
      color: input.color,
      createdAt: now,
      updatedAt: now,
      columns: input.columns?.map((col, i) => ({
        id: crypto.randomUUID(),
        title: col.title,
        order: i,
        cards: col.cards.map((card, j) => ({
          id: crypto.randomUUID(),
          title: card.title,
          description: card.description,
          notes: '',
          priority: card.priority,
          tags: [],
          checklist: [],
          progress: 0,
          timeSpent: 0,
          startDate: null,
          targetDate: null,
          difficulty: 'medium' as const,
          order: j,
          createdAt: now,
          updatedAt: now,
        })),
      })) || [],
    }
    dispatch({ type: 'CREATE_BOARD', payload: newBoard })
  }

  function deleteBoard(id: string) {
    dispatch({ type: 'DELETE_BOARD', payload: id })
  }

  function updateBoard(id: string, updates: Partial<Board>) {
    dispatch({
      type: 'UPDATE_BOARD',
      payload: { id, updates: { ...updates, updatedAt: new Date().toISOString() } },
    })
  }

  function updateCard(boardId: string, cardId: string, updates: Partial<Card>) {
    dispatch({
      type: 'UPDATE_CARD',
      payload: { boardId, cardId, updates: { ...updates, updatedAt: new Date().toISOString() } },
    })
  }

  function getBoardById(id: string) {
    return state.boards.find(b => b.id === id)
  }

  // ─── Column CRUD ────────────────────────────────────

  function addColumn(boardId: string, title: string) {
    const board = getBoardById(boardId)
    if (!board) return

    const maxOrder = board.columns.reduce((max, col) => Math.max(max, col.order), -1)
    const newColumn: Column = {
      id: generateId(),
      title,
      order: maxOrder + 1,
      cards: [],
    }

    dispatch({
      type: 'SET_BOARD',
      payload: {
        id: boardId,
        board: {
          ...board,
          columns: [...board.columns, newColumn],
          updatedAt: new Date().toISOString(),
        },
      },
    })
  }

  function renameColumn(boardId: string, columnId: string, title: string) {
    const board = getBoardById(boardId)
    if (!board) return

    dispatch({
      type: 'SET_BOARD',
      payload: {
        id: boardId,
        board: {
          ...board,
          columns: board.columns.map(col => (col.id === columnId ? { ...col, title } : col)),
          updatedAt: new Date().toISOString(),
        },
      },
    })
  }

  function deleteColumn(boardId: string, columnId: string) {
    const board = getBoardById(boardId)
    if (!board) return

    dispatch({
      type: 'SET_BOARD',
      payload: {
        id: boardId,
        board: {
          ...board,
          columns: board.columns.filter(col => col.id !== columnId),
          updatedAt: new Date().toISOString(),
        },
      },
    })
  }

  function moveColumn(boardId: string, columnId: string, direction: 'left' | 'right') {
    const board = getBoardById(boardId)
    if (!board) return

    const sorted = [...board.columns].sort((a, b) => a.order - b.order)
    const index = sorted.findIndex(col => col.id === columnId)
    const targetIndex = direction === 'right' ? index + 1 : index - 1

    if (targetIndex < 0 || targetIndex >= sorted.length) return

    const sourceOrder = sorted[index].order
    const targetOrder = sorted[targetIndex].order

    dispatch({
      type: 'SET_BOARD',
      payload: {
        id: boardId,
        board: {
          ...board,
          columns: board.columns.map(col => {
            if (col.id === sorted[index].id) return { ...col, order: targetOrder }
            if (col.id === sorted[targetIndex].id) return { ...col, order: sourceOrder }
            return col
          }),
          updatedAt: new Date().toISOString(),
        },
      },
    })
  }

  // ─── Card CRUD ──────────────────────────────────────

  function addCard(boardId: string, columnId: string, title: string) {
    const board = getBoardById(boardId)
    if (!board) return

    const now = new Date().toISOString()
    const newCard: Card = {
      id: generateId(),
      title,
      description: '',
      notes: '',
      priority: 'low',
      tags: [],
      checklist: [],
      progress: 0,
      timeSpent: 0,
      startDate: null,
      targetDate: null,
      difficulty: 'medium',
      order: 0,
      createdAt: now,
      updatedAt: now,
    }

    dispatch({
      type: 'SET_BOARD',
      payload: {
        id: boardId,
        board: {
          ...board,
          columns: board.columns.map(col =>
            col.id === columnId ? { ...col, cards: [...col.cards, newCard] } : col
          ),
          updatedAt: now,
        },
      },
    })
  }

  function renameCard(boardId: string, columnId: string, cardId: string, title: string) {
    const board = getBoardById(boardId)
    if (!board) return

    const now = new Date().toISOString()
    dispatch({
      type: 'SET_BOARD',
      payload: {
        id: boardId,
        board: {
          ...board,
          columns: board.columns.map(col =>
            col.id === columnId
              ? {
                  ...col,
                  cards: col.cards.map(card =>
                    card.id === cardId ? { ...card, title, updatedAt: now } : card
                  ),
                }
              : col
          ),
          updatedAt: now,
        },
      },
    })
  }

  function deleteCard(boardId: string, columnId: string, cardId: string) {
    const board = getBoardById(boardId)
    if (!board) return

    dispatch({
      type: 'SET_BOARD',
      payload: {
        id: boardId,
        board: {
          ...board,
          columns: board.columns.map(col =>
            col.id === columnId
              ? { ...col, cards: col.cards.filter(card => card.id !== cardId) }
              : col
          ),
          updatedAt: new Date().toISOString(),
        },
      },
    })
  }

  function moveCard(boardId: string, cardId: string, direction: 'left' | 'right') {
    const board = getBoardById(boardId)
    if (!board) return

    const sorted = [...board.columns].sort((a, b) => a.order - b.order)
    const sourceIndex = sorted.findIndex(col => col.cards.some(card => card.id === cardId))
    if (sourceIndex === -1) return

    const targetIndex = direction === 'right' ? sourceIndex + 1 : sourceIndex - 1
    if (targetIndex < 0 || targetIndex >= sorted.length) return

    const sourceCol = sorted[sourceIndex]
    const targetCol = sorted[targetIndex]
    const card = sourceCol.cards.find(c => c.id === cardId)
    if (!card) return

    const now = new Date().toISOString()
    dispatch({
      type: 'SET_BOARD',
      payload: {
        id: boardId,
        board: {
          ...board,
          columns: board.columns.map(col => {
            if (col.id === sourceCol.id) {
              return { ...col, cards: col.cards.filter(c => c.id !== cardId) }
            }
            if (col.id === targetCol.id) {
              return { ...col, cards: [...col.cards, { ...card, updatedAt: now }] }
            }
            return col
          }),
          updatedAt: now,
        },
      },
    })
  }

  const value: BoardContextValue = {
    boards: state.boards,
    loading: state.loading,
    createBoard,
    deleteBoard,
    updateBoard,
    updateCard,
    getBoardById,
    addColumn,
    renameColumn,
    deleteColumn,
    moveColumn,
    addCard,
    renameCard,
    deleteCard,
    moveCard,
  }

  return <BoardContext.Provider value={value}>{children}</BoardContext.Provider>
}

// ─── Hook ──────────────────────────────────────────────

export function useBoardContext() {
  const context = useContext(BoardContext)
  if (!context) {
    throw new Error('useBoardContext must be used within a BoardProvider')
  }
  return context
}
