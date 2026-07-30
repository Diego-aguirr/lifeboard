import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { Input } from './Input'

describe('Input', () => {
  it('renders with a label', () => {
    render(<Input label="Email" />)
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
  })

  it('displays error text when error prop is provided', () => {
    render(<Input label="Email" error="Required" />)
    expect(screen.getByText('Required')).toBeInTheDocument()
  })

  it('shows error-styled input when error is provided', () => {
    render(<Input label="Email" error="Invalid email" />)
    const input = screen.getByLabelText('Email')
    expect(input.className).toContain('border-danger')
  })

  it('allows typing', async () => {
    const user = userEvent.setup()
    render(<Input label="Name" />)
    const input = screen.getByLabelText('Name')
    await user.type(input, 'John')
    expect(input).toHaveValue('John')
  })

  it('focuses input when label is clicked', async () => {
    const user = userEvent.setup()
    render(<Input label="Username" />)
    await user.click(screen.getByText('Username'))
    expect(screen.getByLabelText('Username')).toHaveFocus()
  })
})
