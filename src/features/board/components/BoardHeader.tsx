interface BoardHeaderProps {
  icon: string
  title: string
  color: string
}

export function BoardHeader({ icon, title, color }: BoardHeaderProps) {
  return (
    <div className="flex items-center gap-3 p-4 border-b border-border">
      <span className="text-3xl">{icon}</span>
      <h1 className="text-xl font-bold text-foreground">{title}</h1>
      <div
        className="w-3 h-3 rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  )
}
