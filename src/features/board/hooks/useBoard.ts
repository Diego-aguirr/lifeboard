import { useState } from 'react'
import { generateId } from '@/shared/utils/generateId'
import type { Board, Column, Card } from '../types'

interface UseBoardOptions {
  onUpdateBoard?: (id: string, updates: Partial<Board>) => void
}

export function useBoard(initialBoard: Board, options?: UseBoardOptions) {
  const [board, setBoard] = useState<Board>(initialBoard)

  // Sync with context when board changes
  function updateBoard(updates: Partial<Board>) {
    setBoard(prev => {
      const newBoard = { ...prev, ...updates, updatedAt: new Date().toISOString() }
      // Persist to context
      options?.onUpdateBoard?.(prev.id, newBoard)
      return newBoard
    })
  }

  // ─── Column CRUD ────────────────────────────────────

  function addColumn(title: string) {
    const maxOrder = board.columns.reduce((max, col) => Math.max(max, col.order), -1)
    const newColumn: Column = {
      id: generateId(),
      title,
      order: maxOrder + 1,
      cards: [],
    }
    updateBoard({
      columns: [...board.columns, newColumn],
    })
  }

  function renameColumn(id: string, title: string) {
    updateBoard({
      columns: board.columns.map(col => (col.id === id ? { ...col, title } : col)),
    })
  }

  function deleteColumn(id: string) {
    updateBoard({
      columns: board.columns.filter(col => col.id !== id),
    })
  }

  function moveColumn(id: string, direction: 'left' | 'right') {
    const sorted = [...board.columns].sort((a, b) => a.order - b.order)
    const index = sorted.findIndex(col => col.id === id)
    const targetIndex = direction === 'right' ? index + 1 : index - 1

    if (targetIndex < 0 || targetIndex >= sorted.length) return

    const sourceOrder = sorted[index].order
    const targetOrder = sorted[targetIndex].order

    updateBoard({
      columns: board.columns.map(col => {
        if (col.id === sorted[index].id) return { ...col, order: targetOrder }
        if (col.id === sorted[targetIndex].id) return { ...col, order: sourceOrder }
        return col
      }),
    })
  }

  // ─── Card CRUD ──────────────────────────────────────

  function addCard(columnId: string, title: string) {
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
    updateBoard({
      columns: board.columns.map(col =>
        col.id === columnId ? { ...col, cards: [...col.cards, newCard] } : col
      ),
    })
  }

  function renameCard(columnId: string, cardId: string, title: string) {
    const now = new Date().toISOString()
    updateBoard({
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
    })
  }

  function deleteCard(columnId: string, cardId: string) {
    updateBoard({
      columns: board.columns.map(col =>
        col.id === columnId
          ? { ...col, cards: col.cards.filter(card => card.id !== cardId) }
          : col
      ),
    })
  }

  function moveCard(cardId: string, direction: 'left' | 'right') {
    const sorted = [...board.columns].sort((a, b) => a.order - b.order)

    // Find which column has the card
    const sourceIndex = sorted.findIndex(col => col.cards.some(card => card.id === cardId))
    if (sourceIndex === -1) return

    const targetIndex = direction === 'right' ? sourceIndex + 1 : sourceIndex - 1
    if (targetIndex < 0 || targetIndex >= sorted.length) return

    const sourceCol = sorted[sourceIndex]
    const targetCol = sorted[targetIndex]
    const card = sourceCol.cards.find(c => c.id === cardId)
    if (!card) return

    const now = new Date().toISOString()
    updateBoard({
      columns: board.columns.map(col => {
        if (col.id === sourceCol.id) {
          return { ...col, cards: col.cards.filter(c => c.id !== cardId) }
        }
        if (col.id === targetCol.id) {
          return { ...col, cards: [...col.cards, { ...card, updatedAt: now }] }
        }
        return col
      }),
    })
  }

  function updateCard(cardId: string, updates: Partial<Card>) {
    const now = new Date().toISOString()
    updateBoard({
      columns: board.columns.map(col => ({
        ...col,
        cards: col.cards.map(card =>
          card.id === cardId ? { ...card, ...updates, updatedAt: now } : card
        ),
      })),
    })
  }

  // ─── Derived state ──────────────────────────────────

  const columns = [...board.columns].sort((a, b) => a.order - b.order)

  return {
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
  }
}
