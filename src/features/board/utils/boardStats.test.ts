import { describe, it, expect } from 'vitest'
import { calculateBoardProgress, getBoardStats } from './boardStats'
import type { Board } from '../types'

const mockBoard: Board = {
  id: 'board-1',
  title: 'Test Board',
  icon: '📋',
  color: '#3b82f6',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  columns: [
    {
      id: 'col-1',
      title: 'To Do',
      order: 0,
      cards: [
        {
          id: 'card-1',
          title: 'Card 1',
          description: '',
          priority: 'low',
          tags: [],
          checklist: [],
          progress: 50,
          timeSpent: 0,
          startDate: null,
          targetDate: null,
          difficulty: 'easy',
          order: 0,
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-01-01T00:00:00.000Z',
        },
        {
          id: 'card-2',
          title: 'Card 2',
          description: '',
          priority: 'high',
          tags: [],
          checklist: [],
          progress: 100,
          timeSpent: 0,
          startDate: null,
          targetDate: null,
          difficulty: 'medium',
          order: 1,
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-01-01T00:00:00.000Z',
        },
      ],
    },
    {
      id: 'col-2',
      title: 'Done',
      order: 1,
      cards: [
        {
          id: 'card-3',
          title: 'Card 3',
          description: '',
          priority: 'medium',
          tags: [],
          checklist: [],
          progress: 100,
          timeSpent: 0,
          startDate: null,
          targetDate: null,
          difficulty: 'hard',
          order: 0,
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-01-01T00:00:00.000Z',
        },
      ],
    },
  ],
}

describe('calculateBoardProgress', () => {
  it('calculates average progress across all cards', () => {
    // (50 + 100 + 100) / 3 = 83.33 -> 83
    expect(calculateBoardProgress(mockBoard)).toBe(83)
  })

  it('returns 0 for empty board', () => {
    const emptyBoard: Board = {
      ...mockBoard,
      columns: [],
    }
    expect(calculateBoardProgress(emptyBoard)).toBe(0)
  })

  it('returns 0 for board with no cards', () => {
    const noCardsBoard: Board = {
      ...mockBoard,
      columns: [{ id: 'col-1', title: 'Empty', order: 0, cards: [] }],
    }
    expect(calculateBoardProgress(noCardsBoard)).toBe(0)
  })
})

describe('getBoardStats', () => {
  it('returns correct stats', () => {
    const stats = getBoardStats(mockBoard)
    expect(stats.totalCards).toBe(3)
    expect(stats.completedCards).toBe(2)
    expect(stats.totalColumns).toBe(2)
    expect(stats.completionRate).toBe(67)
  })

  it('returns zeros for empty board', () => {
    const emptyBoard: Board = {
      ...mockBoard,
      columns: [],
    }
    const stats = getBoardStats(emptyBoard)
    expect(stats.totalCards).toBe(0)
    expect(stats.completedCards).toBe(0)
    expect(stats.totalColumns).toBe(0)
    expect(stats.completionRate).toBe(0)
  })
})
