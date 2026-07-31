import { describe, it, expect } from 'vitest'
import { boardsSchema, boardSchema, columnSchema, cardSchema } from './board.schema'

describe('boardSchema', () => {
  const validBoard = {
    id: 'abc123',
    title: 'My Board',
    icon: '📋',
    color: '#3b82f6',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    columns: [],
  }

  it('accepts valid board', () => {
    const result = boardSchema.safeParse(validBoard)
    expect(result.success).toBe(true)
  })

  it('rejects board with missing fields', () => {
    const result = boardSchema.safeParse({ id: '1' })
    expect(result.success).toBe(false)
  })

  it('rejects board with wrong types', () => {
    const result = boardSchema.safeParse({
      ...validBoard,
      id: 123,
    })
    expect(result.success).toBe(false)
  })
})

describe('cardSchema', () => {
  const validCard = {
    id: 'card-1',
    title: 'Learn React',
    description: '',
    priority: 'high',
    tags: [],
    checklist: [],
    progress: 0,
    timeSpent: 0,
    startDate: null,
    targetDate: null,
    difficulty: 'medium',
    order: 0,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  }

  it('accepts valid card', () => {
    const result = cardSchema.safeParse(validCard)
    expect(result.success).toBe(true)
  })

  it('rejects invalid priority', () => {
    const result = cardSchema.safeParse({ ...validCard, priority: 'urgent' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid difficulty', () => {
    const result = cardSchema.safeParse({ ...validCard, difficulty: 'impossible' })
    expect(result.success).toBe(false)
  })
})

describe('columnSchema', () => {
  const validColumn = {
    id: 'col-1',
    title: 'To Do',
    order: 0,
    cards: [],
  }

  it('accepts valid column', () => {
    const result = columnSchema.safeParse(validColumn)
    expect(result.success).toBe(true)
  })

  it('accepts column with cards', () => {
    const result = columnSchema.safeParse({
      ...validColumn,
      cards: [
        {
          id: 'card-1',
          title: 'Task',
          description: '',
          priority: 'low',
          tags: [],
          checklist: [],
          progress: 0,
          timeSpent: 0,
          startDate: null,
          targetDate: null,
          difficulty: 'easy',
          order: 0,
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-01-01T00:00:00.000Z',
        },
      ],
    })
    expect(result.success).toBe(true)
  })
})

describe('boardsSchema', () => {
  it('accepts empty array', () => {
    const result = boardsSchema.safeParse([])
    expect(result.success).toBe(true)
  })

  it('accepts array of boards', () => {
    const result = boardsSchema.safeParse([
      {
        id: '1',
        title: 'Board 1',
        icon: '📋',
        color: '#3b82f6',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
        columns: [],
      },
    ])
    expect(result.success).toBe(true)
  })

  it('rejects non-array', () => {
    const result = boardsSchema.safeParse('not an array')
    expect(result.success).toBe(false)
  })

  it('rejects array with invalid board', () => {
    const result = boardsSchema.safeParse([{ id: 123 }])
    expect(result.success).toBe(false)
  })
})
