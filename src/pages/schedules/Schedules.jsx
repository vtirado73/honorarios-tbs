import { useNavigate } from 'react-router-dom'
import { useMemo } from 'react'
import { useSchedules } from '../../modules/schedules/hooks/useSchedules'

export default function Schedules() {
  const navigate = useNavigate()
  const { schedules, loading, error } = useSchedules()

  const groups = useMemo(() => {
    const map = new Map()
    for (const s of schedules) {
      const k = `${s.professor_id}|${s.subject_id}|${s.period_id}`
      if (!map.has(k)) {
        map.set(k, {
          professor_id: s.professor_id,
          subject_id: s.subject_id,
          period_id: s.period_id,
          professor_ci: s.professor_ci,
          professor_name: s.professor_name,
          subject_name: s.subject_name,
          period_name: s.period_name,
          count: 1,
          shifts: new Set([s.shift]),
        })
      } else {
        const g = map.get(k)
        g.count++
        if (s.shift) g.shifts.add(s.shift)
      }
    }
    return Array.from(map.values())
  }, [schedules])

  if (error) {
    return (
      <div className="p-4 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg">
        Error al cargar horarios: {error}
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Horarios</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Gestión de horarios de clases
          </p>
        </div>
        <button
          onClick={() => navigate('/schedules/registro')}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nuevo
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 text-left text-gray-600 dark:text-gray-400">
                <th className="px-4 py-3 font-medium w-16">N°</th>
                <th className="px-4 py-3 font-medium">CI</th>
                <th className="px-4 py-3 font-medium">Docente</th>
                <th className="px-4 py-3 font-medium">Asignatura</th>
                <th className="px-4 py-3 font-medium">Periodo</th>
                <th className="px-4 py-3 font-medium w-24">Turno</th>
                <th className="px-4 py-3 font-medium w-20 text-center">Cant.</th>
                <th className="px-4 py-3 font-medium w-20 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-400">Cargando...</td>
                </tr>
              ) : groups.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-400">No hay horarios registrados</td>
                </tr>
              ) : (
                groups.map((g, i) => (
                  <tr key={`${g.professor_id}|${g.subject_id}|${g.period_id}`} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{i + 1}</td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">{g.professor_ci}</td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">{g.professor_name}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{g.subject_name}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{g.period_name}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300 capitalize">
                      {g.shifts.size > 0 ? Array.from(g.shifts).filter(Boolean).join(', ') : '—'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                        {g.count}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => navigate('/schedules/registro', { state: { editGroup: { professorId: g.professor_id, subjectId: g.subject_id, periodId: g.period_id } } })}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:text-indigo-400 dark:hover:bg-indigo-900/20 transition-colors"
                        title="Editar grupo"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}