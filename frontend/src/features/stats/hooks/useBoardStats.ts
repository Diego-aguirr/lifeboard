import { useMemo } from 'react'
import type { Board } from '@/features/board/types'

interface BoardStats {
  totalCards: number
  completedCards: number
  totalChecklistItems: number
  completedChecklistItems: number
  cardsByPriority: { name: string; value: number; color: string }[]
  cardsByDifficulty: { name: string; value: number; color: string }[]
  cardsByColumn: { name: string; value: number }[]
  completionRate: number
}

export function useBoardStats(boards: Board[]): BoardStats {
  return useMemo(() => {
    const allCards = boards.flatMap(b => b.columns.flatMap(c => c.cards))
    const allChecklist = allCards.flatMap(c => c.checklist)

    const completedCards = allCards.filter(c => c.progress >= 100).length
    const completedChecklistItems = allChecklist.filter(i => i.completed).length

    const cardsByPriority = [
      { name: 'Baja', value: allCards.filter(c => c.priority === 'low').length, color: '#22c55e' },
      { name: 'Media', value: allCards.filter(c => c.priority === 'medium').length, color: '#eab308' },
      { name: 'Alta', value: allCards.filter(c => c.priority === 'high').length, color: '#ef4444' },
    ]

    const cardsByDifficulty = [
      { name: 'Fácil', value: allCards.filter(c => c.difficulty === 'easy').length, color: '#22c55e' },
      { name: 'Media', value: allCards.filter(c => c.difficulty === 'medium').length, color: '#eab308' },
      { name: 'Difícil', value: allCards.filter(c => c.difficulty === 'hard').length, color: '#ef4444' },
    ]

    const cardsByColumn = boards.flatMap(b =>
      b.columns.map(col => ({
        name: col.title,
        value: col.cards.length,
      }))
    )

    const completionRate = allCards.length > 0
      ? Math.round((completedCards / allCards.length) * 100)
      : 0

    return {
      totalCards: allCards.length,
      completedCards,
      totalChecklistItems: allChecklist.length,
      completedChecklistItems,
      cardsByPriority,
      cardsByDifficulty,
      cardsByColumn,
      completionRate,
    }
  }, [boards])
}
