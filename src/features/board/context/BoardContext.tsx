import { createContext, useContext, useReducer, useEffect, useCallback, type ReactNode } from 'react'
import { storage } from '@/shared/storage/StorageService'
import { boardsSchema } from '@/shared/validations/board.schema'
import { debounce } from '@/lib/utils'
import type { Board, Card } from '../types'

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

    default:
      return state
  }
}

// ─── Context ───────────────────────────────────────────

interface BoardContextValue {
  boards: Board[]
  loading: boolean
  createBoard: (input: { title: string; icon: string; color: string }) => void
  deleteBoard: (id: string) => void
  updateBoard: (id: string, updates: Partial<Board>) => void
  updateCard: (boardId: string, cardId: string, updates: Partial<Card>) => void
  getBoardById: (id: string) => Board | undefined
}

const BoardContext = createContext<BoardContextValue | null>(null)

// ─── Provider ──────────────────────────────────────────

export function BoardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(boardReducer, initialState)

  // Load boards from storage on mount
  useEffect(() => {
    const raw = storage.get<unknown>(STORAGE_KEY)
    if (raw === null) {
      dispatch({ type: 'LOAD_BOARDS', payload: [] })
      return
    }

    const result = boardsSchema.safeParse(raw)
    if (!result.success) {
      console.warn('[BoardProvider] Invalid data in storage, resetting')
      dispatch({ type: 'LOAD_BOARDS', payload: [] })
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

  function createBoard(input: { title: string; icon: string; color: string }) {
    const now = new Date().toISOString()
    const newBoard: Board = {
      id: crypto.randomUUID(),
      title: input.title,
      icon: input.icon,
      color: input.color,
      createdAt: now,
      updatedAt: now,
      columns: [],
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

  const value: BoardContextValue = {
    boards: state.boards,
    loading: state.loading,
    createBoard,
    deleteBoard,
    updateBoard,
    updateCard,
    getBoardById,
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
