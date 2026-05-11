import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAsignaturas } from '../../modules/asignaturas/hooks/useAsignaturas'
import { carreraService } from '../../modules/carreras/services/carreraService'

export default function Asignaturas() {
  const navigate = useNavigate()
  const { asignaturas, loading, error, toggleActive } = useAsignaturas()
  const [carrerasMap, setCarrerasMap] = useState({})

  useEffect(() => {
    carreraService.getAll()
      .then(data => {
        const map = {}
        data.forEach(c => { map[c.id] = c.name })
        setCarrerasMap(map)
      })
      .catch(() => {})
  }, [])

  async function handleToggleActive(asignatura) {
    const label = asignatura.active ? 'desactivar' : 'activar'
    if (!window.confirm(`¿Estás seguro de ${label} "${asignatura.name}"?`)) return
    try {
      await toggleActive(asignatura.id)
    } catch {
      alert('Ocurrió un error al cambiar el estado')
    }
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg">
        Error al cargar asignaturas: {error}
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Asignaturas</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Catálogo de asignaturas del instituto
          </p>
        </div>
        <button
          onClick={() => navigate('/asignaturas/registro')}
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
                <th className="px-4 py-3 font-medium w-12">N°</th>
                <th className="px-4 py-3 font-medium w-28">Sigla</th>
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3 font-medium w-16">Nivel</th>
                <th className="px-4 py-3 font-medium">Carrera</th>
                <th className="px-4 py-3 font-medium w-24">Estado</th>
                <th className="px-4 py-3 font-medium w-24 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400">Cargando...</td>
                </tr>
              ) : asignaturas.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                    <p className="mb-3">No hay asignaturas registradas</p>
                    <button
                      onClick={() => navigate('/asignaturas/importar')}
                      className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      Subir asignaturas vía Excel
                    </button>
                  </td>
                </tr>
              ) : (
                asignaturas.map((a, i) => (
                  <tr key={a.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{i + 1}</td>
                    <td className="px-4 py-3">
                      <span className="font-mono font-semibold text-indigo-600 dark:text-indigo-400">{a.acronym}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">{a.name}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300 text-center">{a.nivel ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                      {carrerasMap[a.career_id] || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                        a.active
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                      }`}>
                        {a.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => navigate(`/asignaturas/editar/${a.id}`)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:text-indigo-400 dark:hover:bg-indigo-900/20 transition-colors"
                          title="Editar"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleToggleActive(a)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            a.active
                              ? 'text-gray-500 hover:text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-900/20'
                              : 'text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:text-emerald-400 dark:hover:bg-emerald-900/20'
                          }`}
                          title={a.active ? 'Desactivar' : 'Activar'}
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            {a.active ? (
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
