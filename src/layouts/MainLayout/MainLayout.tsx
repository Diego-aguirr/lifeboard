import { Outlet } from 'react-router'

export function MainLayout() {
  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-14 items-center border-b border-border px-4">
        <h1 className="text-lg font-semibold text-foreground">LifeBoard</h1>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-60 border-r border-border p-4">
          <p className="text-sm text-muted-foreground">Sidebar</p>
        </aside>
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
