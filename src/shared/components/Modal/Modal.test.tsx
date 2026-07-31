import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Modal } from './Modal'

describe('Modal', () => {
  it('renders children when open', () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        <p>Modal content</p>
      </Modal>
    )
    expect(screen.getByText('Modal content')).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    render(
      <Modal isOpen={false} onClose={() => {}}>
        <p>Modal content</p>
      </Modal>
    )
    expect(screen.queryByText('Modal content')).not.toBeInTheDocument()
  })

  it('calls onClose when Escape is pressed', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()

    render(
      <Modal isOpen={true} onClose={onClose}>
        <p>Modal content</p>
      </Modal>
    )

    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when clicking overlay', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()

    render(
      <Modal isOpen={true} onClose={onClose}>
        <p>Modal content</p>
      </Modal>
    )

    await user.click(screen.getByRole('dialog'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not close when clicking content', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()

    render(
      <Modal isOpen={true} onClose={onClose}>
        <p>Modal content</p>
      </Modal>
    )

    await user.click(screen.getByText('Modal content'))
    expect(onClose).not.toHaveBeenCalled()
  })

  it('has correct aria attributes', () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        <p>Modal content</p>
      </Modal>
    )

    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
  })
})
