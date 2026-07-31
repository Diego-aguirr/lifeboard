import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { MainLayout } from './MainLayout'

function renderLayout(path = '/') {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: <MainLayout />,
        children: [{ index: true, element: <p>Page content</p> }],
      },
    ],
    { initialEntries: [path] },
  )
  return render(<RouterProvider router={router} />)
}

describe('MainLayout', () => {
  it('renders the app title in the header', () => {
    renderLayout()
    expect(screen.getByRole('link', { name: 'LifeBoard' })).toBeInTheDocument()
  })

  it('renders the sidebar with toggle button', () => {
    renderLayout()
    expect(screen.getByRole('button', { name: /colapsar sidebar/i })).toBeInTheDocument()
  })

  it('renders child routes in the main content area', () => {
    renderLayout()
    expect(screen.getByText('Page content')).toBeInTheDocument()
  })

  it('collapses sidebar when toggle is clicked', async () => {
    const user = userEvent.setup()
    renderLayout()
    const toggle = screen.getByRole('button', { name: /colapsar sidebar/i })
    await user.click(toggle)
    expect(screen.queryByText('Mis Tableros')).not.toBeInTheDocument()
  })

  it('expands sidebar after collapsing', async () => {
    const user = userEvent.setup()
    renderLayout()
    const toggle = screen.getByRole('button', { name: /colapsar sidebar/i })
    await user.click(toggle)
    expect(screen.queryByText('Mis Tableros')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /expandir sidebar/i }))
    expect(screen.getByText('Mis Tableros')).toBeInTheDocument()
  })
})
