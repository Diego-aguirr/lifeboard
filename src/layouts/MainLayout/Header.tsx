import { Link } from 'react-router'
import { ThemeToggle } from '@/shared/components/ThemeToggle/ThemeToggle'

export function Header() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border px-4" role="banner">
      <Link
        to="/"
        className="text-lg font-semibold text-foreground hover:text-primary transition-colors"
      >
        LifeBoard
      </Link>
      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  )
}
