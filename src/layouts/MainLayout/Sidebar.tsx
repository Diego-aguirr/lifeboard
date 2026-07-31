import { Link, useLocation } from 'react-router'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation()

  return (
    <nav
      className="flex flex-col border-r border-border"
      aria-label="Navegación principal"
    >
      <button
        type="button"
        onClick={onToggle}
        aria-label={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
        aria-expanded={!collapsed}
        className="flex h-10 items-center px-2 text-sm text-muted-foreground hover:bg-surface-hover hover:text-foreground transition-colors"
      >
        {collapsed ? '▶' : '◀'}
      </button>
      {!collapsed && (
        <div className="w-60 p-4">
          <ul className="flex flex-col gap-1" role="list">
            <li>
              <Link
                to="/"
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                  location.pathname === '/'
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-surface-hover hover:text-foreground'
                }`}
                aria-current={location.pathname === '/' ? 'page' : undefined}
              >
                <span aria-hidden="true">📋</span>
                Mis Tableros
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  )
}
