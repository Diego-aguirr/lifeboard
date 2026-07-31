import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { BoardProvider, useBoardContext } from './BoardContext'

function wrapper({ children }: { children: React.ReactNode }) {
  return <BoardProvider>{children}</BoardProvider>
}

describe('BoardContext', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers()
  })

  it('loads boards from storage', async () => {
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

    const { result } = renderHook(() => useBoardContext(), { wrapper })

    await act(async () => {
      vi.advanceTimersByTime(100)
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.boards).toEqual(boards)
  })

  it('loads boards from storage', async () => {
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

    const { result } = renderHook(() => useBoardContext(), { wrapper })

    await act(async () => {
      vi.advanceTimersByTime(100)
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.boards).toEqual(boards)
  })

  it('creates a board', async () => {
    const { result } = renderHook(() => useBoardContext(), { wrapper })

    await act(async () => {
      vi.advanceTimersByTime(100)
    })

    act(() => {
      result.current.createBoard({ title: 'New Board', icon: '📋', color: '#3b82f6' })
    })

    expect(result.current.boards).toHaveLength(1)
    expect(result.current.boards[0].title).toBe('New Board')
  })

  it('deletes a board', async () => {
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

    const { result } = renderHook(() => useBoardContext(), { wrapper })

    await act(async () => {
      vi.advanceTimersByTime(100)
    })

    expect(result.current.boards).toHaveLength(1)

    act(() => {
      result.current.deleteBoard('1')
    })

    expect(result.current.boards).toHaveLength(0)
  })

  it('gets board by id', async () => {
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

    const { result } = renderHook(() => useBoardContext(), { wrapper })

    await act(async () => {
      vi.advanceTimersByTime(100)
    })

    const board = result.current.getBoardById('1')
    expect(board).toBeDefined()
    expect(board?.title).toBe('Board 1')
  })

  it('saves to storage after debounce', async () => {
    const { result } = renderHook(() => useBoardContext(), { wrapper })

    await act(async () => {
      vi.advanceTimersByTime(100)
    })

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
})
