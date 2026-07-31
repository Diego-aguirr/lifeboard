import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { BoardCard } from './BoardCard'
import type { Board } from '@/features/board/types'

const mockBoard: Board = {
  id: 'board-1',
  title: 'Mi proyecto',
  icon: '📁',
  color: '#3b82f6',
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
  columns: [],
}

describe('BoardCard', () => {
  it('renders board title', () => {
    render(<BoardCard board={mockBoard} onClick={() => {}} onDelete={() => {}} />)
    expect(screen.getByText('Mi proyecto')).toBeInTheDocument()
  })

  it('renders board icon', () => {
    render(<BoardCard board={mockBoard} onClick={() => {}} onDelete={() => {}} />)
    expect(screen.getByText('📁')).toBeInTheDocument()
  })

  it('calls onClick when card is clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<BoardCard board={mockBoard} onClick={handleClick} onDelete={() => {}} />)

    await user.click(screen.getByText('Mi proyecto'))

    expect(handleClick).toHaveBeenCalledOnce()
  })

  it('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup()
    const handleDelete = vi.fn()
    render(<BoardCard board={mockBoard} onClick={() => {}} onDelete={handleDelete} />)

    await user.click(screen.getByRole('button', { name: /eliminar/i }))

    expect(handleDelete).toHaveBeenCalledWith('board-1')
  })
})
