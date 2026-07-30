interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <div className="flex flex-col border-r border-border">
      <button
        type="button"
        onClick={onToggle}
        aria-label="Toggle sidebar"
        className="flex h-10 items-center px-2 text-sm text-muted-foreground hover:bg-surface-hover"
      >
        {collapsed ? '▶' : '◀'}
      </button>
      {!collapsed && (
        <aside className="w-60 p-4">
          <p className="text-sm text-muted-foreground">Sidebar</p>
        </aside>
      )}
    </div>
  )
}
