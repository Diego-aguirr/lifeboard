import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { usePersistentBoards } from './usePersistentBoards'

describe('usePersistentBoards', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers()
  })

  it('starts with empty boards when storage is empty', () => {
    const { result } = renderHook(() => usePersistentBoards())
    expect(result.current.boards).toEqual([])
  })

  it('loads boards from storage on mount', () => {
    const boards = [
      {
        id: '1',
        title: 'Test Board',
        icon: '📋',
        color: '#3b82f6',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
        columns: [],
      },
    ]
    localStorage.setItem('lifeboard:boards', JSON.stringify(boards))

    const { result } = renderHook(() => usePersistentBoards())
    expect(result.current.boards).toEqual(boards)
  })

  it('ignores corrupted data and starts empty', () => {
    localStorage.setItem('lifeboard:boards', 'not json')
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const { result } = renderHook(() => usePersistentBoards())
    expect(result.current.boards).toEqual([])
    expect(consoleSpy).toHaveBeenCalled()

    consoleSpy.mockRestore()
  })

  it('creates a board', () => {
    const { result } = renderHook(() => usePersistentBoards())

    act(() => {
      result.current.createBoard({ title: 'New Board', icon: '📋', color: '#3b82f6' })
    })

    expect(result.current.boards).toHaveLength(1)
    expect(result.current.boards[0].title).toBe('New Board')
  })

  it('deletes a board', () => {
    const boards = [
      {
        id: '1',
        title: 'Board 1',
        icon: '📋',
        color: '#3b82f6',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
        columns: [],
      },
    ]
    localStorage.setItem('lifeboard:boards', JSON.stringify(boards))

    const { result } = renderHook(() => usePersistentBoards())
    expect(result.current.boards).toHaveLength(1)

    act(() => {
      result.current.deleteBoard('1')
    })

    expect(result.current.boards).toHaveLength(0)
  })

  it('saves to storage after debounce', async () => {
    const { result } = renderHook(() => usePersistentBoards())

    act(() => {
      result.current.createBoard({ title: 'New Board', icon: '📋', color: '#3b82f6' })
    })

    // Not saved yet
    expect(localStorage.getItem('lifeboard:boards')).toBeNull()

    // Advance past debounce
    act(() => {
      vi.advanceTimersByTime(500)
    })

    // Now saved
    const stored = localStorage.getItem('lifeboard:boards')
    expect(stored).not.toBeNull()
    const parsed = JSON.parse(stored!)
    expect(parsed).toHaveLength(1)
  })

  it('debounces multiple rapid changes', async () => {
    const { result } = renderHook(() => usePersistentBoards())

    act(() => {
      result.current.createBoard({ title: 'Board 1', icon: '📋', color: '#3b82f6' })
    })

    act(() => {
      vi.advanceTimersByTime(200)
    })

    act(() => {
      result.current.createBoard({ title: 'Board 2', icon: '📋', color: '#3b82f6' })
    })

    act(() => {
      vi.advanceTimersByTime(200)
    })

    act(() => {
      result.current.createBoard({ title: 'Board 3', icon: '📋', color: '#3b82f6' })
    })

    // Not saved yet
    expect(localStorage.getItem('lifeboard:boards')).toBeNull()

    // Advance past final debounce
    act(() => {
      vi.advanceTimersByTime(500)
    })

    const stored = localStorage.getItem('lifeboard:boards')
    const parsed = JSON.parse(stored!)
    expect(parsed).toHaveLength(3)
  })
})
