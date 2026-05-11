import { useState } from 'react'
import { useReporte } from '../../modules/reportes/hooks/useReporte'
import WeeklyCalendar from '../../modules/schedules/components/WeeklyCalendar'
import { printReporte } from '../../modules/reportes/utils/printReporte.jsx'

export default function Reportes() {
  const {
    periodos, carreras, asignaturas, docentes, schedules,
    periodId, careerId, nivel,
    loading, niveles,
    handlePeriodChange, handleCareerChange,
    handleNivelChange,
  } = useReporte()
  const [printLoading, setPrintLoading] = useState(false)

  const hasSelection = periodId && careerId && nivel
  const periodName = periodos.find(p => p.id === periodId)?.name || ''
  const careerName = carreras.find(c => c.id === careerId)?.name || ''

  async function handlePrint() {
    if (!hasSelection || schedules.length === 0) return
    try {
      setPrintLoading(true)
      await printReporte({ periodName, careerName, nivel, docentes, schedules })
    } catch {
      alert('Error al generar el PDF')
    } finally {
      setPrintLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reportes</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Visualizar horarios agrupados por periodo, carrera y nivel
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Periodo
            </label>
            <select
              value={periodId}
              onChange={e => handlePeriodChange(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            >
              <option value="">Seleccione un periodo</option>
              {periodos.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Carrera
            </label>
            <select
              value={careerId}
              onChange={e => handleCareerChange(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            >
              <option value="">Seleccione una carrera</option>
              {carreras.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nivel
            </label>
            <select
              value={nivel}
              onChange={e => handleNivelChange(e.target.value)}
              disabled={!careerId}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Seleccione un nivel</option>
              {niveles.map(n => (
                <option key={n} value={n}>Nivel {n}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="relative">
        {hasSelection && (
          <div className="mb-3 flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {careerName} — Nivel {nivel}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {asignaturas.length} asignatura{asignaturas.length !== 1 ? 's' : ''} · {schedules.length} horario{schedules.length !== 1 ? 's' : ''}
              </p>
            </div>
            {schedules.length > 0 && (
              <button
                type="button"
                disabled={printLoading}
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {printLoading ? 'Generando...' : 'PDF'}
              </button>
            )}
          </div>
        )}

        {!hasSelection ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center text-gray-400 dark:text-gray-500">
            Seleccione un periodo, carrera y nivel para ver los horarios
          </div>
        ) : (
          <WeeklyCalendar
            schedules={schedules}
            loading={loading}
            interactive={false}
          />
        )}
      </div>
    </div>
  )
}
