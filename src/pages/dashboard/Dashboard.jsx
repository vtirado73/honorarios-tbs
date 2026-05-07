function StatCard({ title, value, subtitle, color }) {
  const colors = {
    indigo: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400',
    emerald: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
    amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
    rose: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400',
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
      <div className="flex items-center justify-between mb-3">
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[color] || colors.indigo}`}>
          {title}
        </span>
      </div>
      <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
      {subtitle && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
      )}
    </div>
  )
}

export default function Dashboard() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Resumen general del sistema</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Docentes" value="0" subtitle="Totales registrados" color="indigo" />
        <StatCard title="Carreras" value="0" subtitle="Activas" color="emerald" />
        <StatCard title="Asignaturas" value="0" subtitle="En el catálogo" color="amber" />
        <StatCard title="Horarios" value="0" subtitle="Asignados" color="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Últimos movimientos</h2>
          <div className="flex items-center justify-center h-32 text-gray-400 dark:text-gray-500 text-sm">
            No hay movimientos registrados.
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Resumen de pagos</h2>
          <div className="flex items-center justify-center h-32 text-gray-400 dark:text-gray-500 text-sm">
            No hay pagos registrados en el periodo actual.
          </div>
        </div>
      </div>
    </div>
  )
}
