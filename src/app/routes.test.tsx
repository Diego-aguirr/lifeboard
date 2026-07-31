import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { routes } from './routes'

function renderRoute(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  return render(<RouterProvider router={router} />)
}

describe('Router', () => {
  it('renders Dashboard at root path /', () => {
    renderRoute('/')
    expect(screen.getByText('Mis Tableros')).toBeInTheDocument()
  })

  it('shows not found for nonexistent board', () => {
    renderRoute('/board/abc123')
    expect(screen.getByText('Tablero no encontrado')).toBeInTheDocument()
  })

  it('redirects unknown routes to Dashboard', () => {
    renderRoute('/nonexistent')
    expect(screen.getByText('Mis Tableros')).toBeInTheDocument()
  })
})
