import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useBoards } from './useBoards'

describe('useBoards', () => {
  it('returns empty boards initially', () => {
    const { result } = renderHook(() => useBoards())
    expect(result.current.boards).toEqual([])
  })

  it('creates a board with generated id, title, icon, and color', () => {
    const { result } = renderHook(() => useBoards())

    act(() => {
      result.current.createBoard({ title: 'Mi proyecto', icon: '📁', color: '#3b82f6' })
    })

    expect(result.current.boards).toHaveLength(1)
    expect(result.current.boards[0].title).toBe('Mi proyecto')
    expect(result.current.boards[0].icon).toBe('📁')
    expect(result.current.boards[0].color).toBe('#3b82f6')
    expect(result.current.boards[0].id).toBeTruthy()
    expect(typeof result.current.boards[0].id).toBe('string')
    expect(result.current.boards[0].columns).toEqual([])
  })

  it('creates multiple boards with unique ids', () => {
    const { result } = renderHook(() => useBoards())

    act(() => {
      result.current.createBoard({ title: 'Board A', icon: '🎯', color: '#ef4444' })
    })
    act(() => {
      result.current.createBoard({ title: 'Board B', icon: '🚀', color: '#22c55e' })
    })

    expect(result.current.boards).toHaveLength(2)
    expect(result.current.boards[0].id).not.toBe(result.current.boards[1].id)
  })

  it('deletes a board by id', () => {
    const { result } = renderHook(() => useBoards())

    act(() => {
      result.current.createBoard({ title: 'To Delete', icon: '🗑️', color: '#f59e0b' })
    })

    const boardId = result.current.boards[0].id

    act(() => {
      result.current.deleteBoard(boardId)
    })

    expect(result.current.boards).toEqual([])
  })

  it('deletes only the targeted board', () => {
    const { result } = renderHook(() => useBoards())

    act(() => {
      result.current.createBoard({ title: 'Keep', icon: '✅', color: '#22c55e' })
    })
    act(() => {
      result.current.createBoard({ title: 'Remove', icon: '❌', color: '#ef4444' })
    })

    const removeId = result.current.boards.find(b => b.title === 'Remove')!.id

    act(() => {
      result.current.deleteBoard(removeId)
    })

    expect(result.current.boards).toHaveLength(1)
    expect(result.current.boards[0].title).toBe('Keep')
  })

  it('sets createdAt and updatedAt timestamps', () => {
    const { result } = renderHook(() => useBoards())
    const before = Date.now()

    act(() => {
      result.current.createBoard({ title: 'Timestamped', icon: '⏰', color: '#8b5cf6' })
    })

    const after = Date.now()
    const board = result.current.boards[0]

    expect(new Date(board.createdAt).getTime()).toBeGreaterThanOrEqual(before)
    expect(new Date(board.createdAt).getTime()).toBeLessThanOrEqual(after)
    expect(board.updatedAt).toBe(board.createdAt)
  })
})
