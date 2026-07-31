import { Link } from 'react-router'

interface BoardHeaderProps {
  icon: string
  title: string
  color: string
}

export function BoardHeader({ icon, title, color }: BoardHeaderProps) {
  return (
    <div className="flex items-center gap-3 p-4 border-b border-border">
      <Link
        to="/"
        className="flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-colors"
        aria-label="Volver al Dashboard"
        title="Volver al Dashboard"
      >
        ←
      </Link>
      <span className="text-3xl" aria-hidden="true">{icon}</span>
      <h1 className="text-xl font-bold text-foreground">{title}</h1>
      <div
        className="w-3 h-3 rounded-full"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />
    </div>
  )
}
