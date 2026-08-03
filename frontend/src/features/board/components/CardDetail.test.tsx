import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { CardDetail } from './CardDetail'
import type { Card } from '../types'

const mockCard: Card = {
  id: 'card-1',
  title: 'Test Card',
  description: 'Test description',
  priority: 'high',
  tags: ['react', 'typescript'],
  checklist: [
    { id: 'item-1', text: 'Item 1', completed: true },
    { id: 'item-2', text: 'Item 2', completed: false },
  ],
  progress: 50,
  timeSpent: 0,
  startDate: null,
  targetDate: null,
  difficulty: 'medium',
  order: 0,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

describe('CardDetail', () => {
  it('renders card details when open', () => {
    render(
      <CardDetail
        card={mockCard}
        isOpen={true}
        onClose={() => {}}
        onSave={() => {}}
      />
    )

    expect(screen.getByDisplayValue('Test Card')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Test description')).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    render(
      <CardDetail
        card={mockCard}
        isOpen={false}
        onClose={() => {}}
        onSave={() => {}}
      />
    )

    expect(screen.queryByDisplayValue('Test Card')).not.toBeInTheDocument()
  })

  it('calls onClose when cancel is clicked', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()

    render(
      <CardDetail
        card={mockCard}
        isOpen={true}
        onClose={onClose}
        onSave={() => {}}
      />
    )

    await user.click(screen.getByText('Cancelar'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onSave with updated data when form is submitted', async () => {
    const onSave = vi.fn()
    const user = userEvent.setup()

    render(
      <CardDetail
        card={mockCard}
        isOpen={true}
        onClose={() => {}}
        onSave={onSave}
      />
    )

    await user.click(screen.getByText('Guardar'))
    expect(onSave).toHaveBeenCalledTimes(1)
  })

  it('renders checklist items', () => {
    render(
      <CardDetail
        card={mockCard}
        isOpen={true}
        onClose={() => {}}
        onSave={() => {}}
      />
    )

    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()
    expect(screen.getByText(/Checklist \(1\/2\)/)).toBeInTheDocument()
  })

  it('renders tags', () => {
    render(
      <CardDetail
        card={mockCard}
        isOpen={true}
        onClose={() => {}}
        onSave={() => {}}
      />
    )

    expect(screen.getByText('react')).toBeInTheDocument()
    expect(screen.getByText('typescript')).toBeInTheDocument()
  })

  it('adds new checklist item', async () => {
    const user = userEvent.setup()

    render(
      <CardDetail
        card={mockCard}
        isOpen={true}
        onClose={() => {}}
        onSave={() => {}}
      />
    )

    const input = screen.getByLabelText('Nuevo item de checklist')
    await user.type(input, 'New item')
    await user.click(screen.getByLabelText('Nuevo item de checklist').parentElement!.querySelector('button')!)

    expect(screen.getByText('New item')).toBeInTheDocument()
  })

  it('adds new tag', async () => {
    const user = userEvent.setup()

    render(
      <CardDetail
        card={mockCard}
        isOpen={true}
        onClose={() => {}}
        onSave={() => {}}
      />
    )

    const input = screen.getByLabelText('Nueva etiqueta')
    await user.type(input, 'newtag')
    await user.click(screen.getByLabelText('Nueva etiqueta').parentElement!.querySelector('button')!)

    expect(screen.getByText('newtag')).toBeInTheDocument()
  })
})
