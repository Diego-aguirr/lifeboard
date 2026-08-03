import type { Board } from '../types'

/**
 * Calculate board progress as the average of all card progresses.
 * Returns a number between 0 and 100.
 */
export function calculateBoardProgress(board: Board): number {
  const allCards = board.columns.flatMap(col => col.cards)

  if (allCards.length === 0) return 0

  const totalProgress = allCards.reduce((sum, card) => sum + card.progress, 0)
  return Math.round(totalProgress / allCards.length)
}

/**
 * Get card count statistics for a board.
 */
export function getBoardStats(board: Board) {
  const allCards = board.columns.flatMap(col => col.cards)
  const totalCards = allCards.length
  const completedCards = allCards.filter(card => card.progress === 100).length
  const totalColumns = board.columns.length

  return {
    totalCards,
    completedCards,
    totalColumns,
    completionRate: totalCards > 0 ? Math.round((completedCards / totalCards) * 100) : 0,
  }
}
