import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Badge } from './Badge'

describe('Badge', () => {
  it('renders children text', () => {
    render(<Badge>New</Badge>)
    expect(screen.getByText('New')).toBeInTheDocument()
  })

  it('applies default variant styles', () => {
    render(<Badge>Default</Badge>)
    const badge = screen.getByText('Default')
    expect(badge.className).toContain('bg-muted')
  })

  it('applies success variant styles', () => {
    render(<Badge variant="success">Done</Badge>)
    const badge = screen.getByText('Done')
    expect(badge.className).toContain('bg-success')
  })

  it('applies warning variant styles', () => {
    render(<Badge variant="warning">Pending</Badge>)
    const badge = screen.getByText('Pending')
    expect(badge.className).toContain('bg-warning')
  })

  it('applies danger variant styles', () => {
    render(<Badge variant="danger">Error</Badge>)
    const badge = screen.getByText('Error')
    expect(badge.className).toContain('bg-danger')
  })

  it('applies info variant styles', () => {
    render(<Badge variant="info">Info</Badge>)
    const badge = screen.getByText('Info')
    expect(badge.className).toContain('bg-info')
  })

  it('renders as inline element', () => {
    render(<Badge>Tag</Badge>)
    const badge = screen.getByText('Tag')
    expect(badge.tagName).toBe('SPAN')
  })
})
