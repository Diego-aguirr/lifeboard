import { useBoardContext } from '@/features/board/context/BoardContext'
import { useBoardStats } from '@/features/stats/hooks/useBoardStats'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts'

export function StatsPage() {
  const { boards } = useBoardContext()
  const stats = useBoardStats(boards)

  if (boards.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-foreground mb-6">Estadísticas</h1>
        <p className="text-muted-foreground text-center mt-8">
          No hay datos para mostrar. Crea un tablero con tarjetas para ver estadísticas.
        </p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-foreground mb-6">Estadísticas</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="Tableros" value={boards.length} />
        <StatCard label="Tarjetas" value={stats.totalCards} />
        <StatCard label="Completadas" value={stats.completedCards} />
        <StatCard label="Tasa de éxito" value={`${stats.completionRate}%`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cards by column */}
        <div className="bg-surface border border-border rounded-xl p-6">
          <h2 className="text-sm font-semibold text-foreground mb-4">Tarjetas por columna</h2>
          {stats.cardsByColumn.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats.cardsByColumn}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="name" tick={{ fill: 'var(--color-foreground)', fontSize: 12 }} />
                <YAxis tick={{ fill: 'var(--color-foreground)', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="value" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground text-sm text-center py-8">Sin datos</p>
          )}
        </div>

        {/* Cards by priority */}
        <div className="bg-surface border border-border rounded-xl p-6">
          <h2 className="text-sm font-semibold text-foreground mb-4">Tarjetas por prioridad</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={stats.cardsByPriority}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {stats.cardsByPriority.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Cards by difficulty */}
        <div className="bg-surface border border-border rounded-xl p-6">
          <h2 className="text-sm font-semibold text-foreground mb-4">Tarjetas por dificultad</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={stats.cardsByDifficulty}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {stats.cardsByDifficulty.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Checklist progress */}
        <div className="bg-surface border border-border rounded-xl p-6">
          <h2 className="text-sm font-semibold text-foreground mb-4">Progreso de checklists</h2>
          <div className="flex flex-col items-center justify-center h-[250px]">
            <div className="text-5xl font-bold text-primary mb-2">
              {stats.totalChecklistItems > 0
                ? Math.round((stats.completedChecklistItems / stats.totalChecklistItems) * 100)
                : 0}%
            </div>
            <p className="text-muted-foreground text-sm">
              {stats.completedChecklistItems} de {stats.totalChecklistItems} items completados
            </p>
            {stats.totalChecklistItems > 0 && (
              <div className="w-48 h-3 bg-secondary rounded-full mt-4 overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{
                    width: `${Math.round((stats.completedChecklistItems / stats.totalChecklistItems) * 100)}%`,
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-surface border border-border rounded-xl p-4 text-center">
      <p className="text-2xl font-bold text-primary">{value}</p>
      <p className="text-sm text-muted-foreground mt-1">{label}</p>
    </div>
  )
}
