import { Link } from 'react-router'

export function Header() {
  return (
    <header className="flex h-14 items-center border-b border-border px-4" role="banner">
      <Link
        to="/"
        className="text-lg font-semibold text-foreground hover:text-primary transition-colors"
      >
        LifeBoard
      </Link>
    </header>
  )
}
