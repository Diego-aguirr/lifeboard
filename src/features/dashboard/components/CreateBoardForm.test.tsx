import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { CreateBoardForm } from './CreateBoardForm'

describe('CreateBoardForm', () => {
  it('renders a text input and submit button', () => {
    render(<CreateBoardForm onCreate={() => {}} />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /crear/i })).toBeInTheDocument()
  })

  it('calls onCreate with title when form is submitted', async () => {
    const user = userEvent.setup()
    const handleCreate = vi.fn()
    render(<CreateBoardForm onCreate={handleCreate} />)

    await user.type(screen.getByRole('textbox'), 'Mi tablero')
    await user.click(screen.getByRole('button', { name: /crear/i }))

    expect(handleCreate).toHaveBeenCalledWith('Mi tablero')
  })

  it('clears input after successful submission', async () => {
    const user = userEvent.setup()
    render(<CreateBoardForm onCreate={() => {}} />)

    const input = screen.getByRole('textbox')
    await user.type(input, 'Tablero')
    await user.click(screen.getByRole('button', { name: /crear/i }))

    expect(input).toHaveValue('')
  })

  it('does not call onCreate with empty title', async () => {
    const user = userEvent.setup()
    const handleCreate = vi.fn()
    render(<CreateBoardForm onCreate={handleCreate} />)

    await user.click(screen.getByRole('button', { name: /crear/i }))

    expect(handleCreate).not.toHaveBeenCalled()
  })
})
