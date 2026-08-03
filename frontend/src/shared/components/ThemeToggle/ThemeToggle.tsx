import { useTheme } from '@/lib/theme-provider'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  function toggleTheme() {
    if (theme === 'dark') {
      setTheme('light')
    } else if (theme === 'light') {
      setTheme('system')
    } else {
      setTheme('dark')
    }
  }

  const icon = theme === 'dark' ? '🌙' : theme === 'light' ? '☀️' : '💻'
  const label = theme === 'dark' ? 'Tema oscuro' : theme === 'light' ? 'Tema claro' : 'Tema del sistema'

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-surface-hover hover:text-foreground transition-colors"
      aria-label={`Tema actual: ${label}. Clic para cambiar.`}
      title={label}
    >
      <span aria-hidden="true">{icon}</span>
      <span className="hidden sm:inline">{label}</span>
    </button>
  )
}
