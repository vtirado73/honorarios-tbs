import { useNavigate } from 'react-router-dom'
import { useDocentes } from '../../modules/docentes/hooks/useDocentes'

export default function Docentes() {
  const navigate = useNavigate()
  const { docentes, loading, error, toggleActive } = useDocentes()

  async function handleToggleActive(docente) {
    const label = docente.active ? 'desactivar' : 'activar'
    if (!window.confirm(`¿Estás seguro de ${label} a ${docente.name} ${docente.lastname}?`)) return
    try {
      await toggleActive(docente.id)
    } catch {
      alert('Ocurrió un error al cambiar el estado')
    }
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg">
        Error al cargar docentes: {error}
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Docentes</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Gestión de docentes del instituto
          </p>
        </div>
        <button
          onClick={() => navigate('/docentes/registro')}
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
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
                <th className="px-4 py-3 font-medium">N°</th>
                <th className="px-4 py-3 font-medium">CI</th>
                <th className="px-4 py-3 font-medium">Nombre completo</th>
                <th className="px-4 py-3 font-medium">Correo electrónico</th>
                <th className="px-4 py-3 font-medium">Teléfono</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                    Cargando...
                  </td>
                </tr>
              ) : docentes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                    <p className="mb-3">No hay docentes registrados</p>
                    <button
                      onClick={() => navigate('/docentes/importar')}
                      className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      Subir docentes vía Excel
                    </button>
                  </td>
                </tr>
              ) : (
                docentes.map((d, i) => (
                  <tr key={d.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{i + 1}</td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">{d.ci}</td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">
                      {d.lastname} {d.surname}, {d.name}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{d.email}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{d.phone || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                        d.active
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                      }`}>
                        {d.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => navigate(`/docentes/editar/${d.id}`)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:text-primary-400 dark:hover:bg-primary-900/20 transition-colors"
                          title="Editar"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleToggleActive(d)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            d.active
                              ? 'text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-900/20'
                              : 'text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:text-emerald-400 dark:hover:bg-emerald-900/20'
                          }`}
                          title={d.active ? 'Desactivar' : 'Activar'}
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            {d.active ? (
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
