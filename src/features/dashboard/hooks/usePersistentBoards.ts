import { useState, useEffect, useCallback } from 'react'
import { storage } from '@/shared/storage/StorageService'
import { boardsSchema } from '@/shared/validations/board.schema'
import { debounce } from '@/lib/utils'
import type { Board } from '@/features/board/types'

const STORAGE_KEY = 'boards'

function loadBoards(): Board[] {
  const raw = storage.get<unknown>(STORAGE_KEY)
  if (raw === null) return []

  const result = boardsSchema.safeParse(raw)
  if (!result.success) {
    console.warn('[usePersistentBoards] Invalid data in storage, resetting:', result.error.issues)
    return []
  }

  return result.data as Board[]
}

export function usePersistentBoards() {
  const [boards, setBoards] = useState<Board[]>(() => loadBoards())

  // Debounced save to localStorage
  const saveBoards = useCallback(
    debounce((data: Board[]) => {
      storage.set(STORAGE_KEY, data)
    }, 500),
    []
  )

  // Save on change
  useEffect(() => {
    saveBoards(boards)
  }, [boards, saveBoards])

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      saveBoards.cancel()
    }
  }, [saveBoards])

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
    setBoards(prev => [...prev, newBoard])
  }

  function deleteBoard(id: string) {
    setBoards(prev => prev.filter(board => board.id !== id))
  }

  return { boards, createBoard, deleteBoard }
}
