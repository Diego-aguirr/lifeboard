import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/globals.css'
import App from '@/app/App'
import { ThemeProvider } from '@/lib/theme-provider'
import { BoardProvider } from '@/features/board/context/BoardContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <ThemeProvider defaultTheme="system">
        <BoardProvider>
          <App />
        </BoardProvider>
      </ThemeProvider>
    </StrictMode>,
)
