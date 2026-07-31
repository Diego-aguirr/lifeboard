import { useState } from 'react'
import { generateId } from '@/shared/utils/generateId'
import type { Board } from '@/features/board/types'

interface CreateBoardInput {
  title: string
  icon: string
  color: string
}

export function useBoards() {
  const [boards, setBoards] = useState<Board[]>([])

  function createBoard({ title, icon, color }: CreateBoardInput) {
    const now = new Date().toISOString()
    const newBoard: Board = {
      id: generateId(),
      title,
      icon,
      color,
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
