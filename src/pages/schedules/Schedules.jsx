import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSchedules } from '../../modules/schedules/hooks/useSchedules'
import { periodoService } from '../../modules/periodos/services/periodoService'

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export default function Schedules() {
  const navigate = useNavigate()
  const { schedules, loading, error, toggleActive } = useSchedules()
  const [periodos, setPeriodos] = useState([])
  const [search, setSearch] = useState('')
  const [selectedPeriodId, setSelectedPeriodId] = useState('')

  useEffect(() => {
    let mounted = true
    periodoService.getAll().then(data => { if (mounted) setPeriodos(data) }).catch(() => {})
    return () => { mounted = false }
  }, [])

  const filteredSchedules = schedules.filter(s => {
    const q = search.toLowerCase().trim()
    if (q) {
      const haystack = [
        s.professor_name,
        s.subject_name,
        s.period_name,
        s.day,
        s.shift,
      ].join(' ').toLowerCase()
      if (!haystack.includes(q)) return false
    }
    if (selectedPeriodId && s.period_id !== selectedPeriodId) return false
    return true
  })

  async function handleToggleActive(schedule) {
    const label = schedule.active ? 'desactivar' : 'activar'
    if (!window.confirm(`¿Estás seguro de ${label} este horario?`)) return
    try {
      await toggleActive(schedule.id)
    } catch {
      alert('Ocurrió un error al cambiar el estado')
    }
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg">
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

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por docente, asignatura, periodo, día o turno..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
          />
        </div>
        <select
          value={selectedPeriodId}
          onChange={e => setSelectedPeriodId(e.target.value)}
          className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
        >
          <option value="">Todos los periodos</option>
          {periodos.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 text-left text-gray-600 dark:text-gray-400">
                <th className="px-4 py-3 font-medium w-16">N°</th>
                <th className="px-4 py-3 font-medium">Docente</th>
                <th className="px-4 py-3 font-medium">Asignatura</th>
                <th className="px-4 py-3 font-medium">Periodo</th>
                <th className="px-4 py-3 font-medium">Día</th>
                <th className="px-4 py-3 font-medium">Horario</th>
                <th className="px-4 py-3 font-medium">Turno</th>
                <th className="px-4 py-3 font-medium w-24">Estado</th>
                <th className="px-4 py-3 font-medium w-24 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-gray-400">Cargando...</td>
                </tr>
              ) : filteredSchedules.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-gray-400">No hay horarios registrados</td>
                </tr>
              ) : (
                filteredSchedules.map((s, i) => (
                  <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{i + 1}</td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">{s.professor_name}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{s.subject_name}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{s.period_name}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{capitalize(s.day)}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{s.start_at} - {s.end_at}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{capitalize(s.shift)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                        s.active
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                      }`}>
                        {s.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => navigate(`/schedules/editar/${s.id}`)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:text-indigo-400 dark:hover:bg-indigo-900/20 transition-colors"
                          title="Editar"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleToggleActive(s)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            s.active
                              ? 'text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-900/20'
                              : 'text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:text-emerald-400 dark:hover:bg-emerald-900/20'
                          }`}
                          title={s.active ? 'Desactivar' : 'Activar'}
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            {s.active ? (
                              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            )}
                          </svg>
                        </button>
                      </div>
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
