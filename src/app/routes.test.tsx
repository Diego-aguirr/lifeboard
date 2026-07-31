import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { routes } from './routes'
import { BoardProvider } from '@/features/board/context/BoardContext'

function renderRoute(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  return render(
    <BoardProvider>
      <RouterProvider router={router} />
    </BoardProvider>
  )
}

describe('Router', () => {
  it('renders Dashboard at root path /', () => {
    renderRoute('/')
    expect(screen.getByRole('heading', { name: 'Mis Tableros' })).toBeInTheDocument()
  })

  it('shows not found for nonexistent board', () => {
    renderRoute('/board/abc123')
    expect(screen.getByText('Tablero no encontrado')).toBeInTheDocument()
  })

  it('redirects unknown routes to Dashboard', () => {
    renderRoute('/nonexistent')
    expect(screen.getByRole('heading', { name: 'Mis Tableros' })).toBeInTheDocument()
  })
})
