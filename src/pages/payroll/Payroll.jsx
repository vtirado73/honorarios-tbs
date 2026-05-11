import { useState, useEffect, useMemo } from 'react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { honorarioService } from '../../modules/honorarios/services/honorarioService'
import HonorarioPDF from '../../modules/honorarios/components/HonorarioPDF'
import db from '../../database/db'

export default function Payroll() {
  const [periodos, setPeriodos] = useState([])
  const [allDocentes, setAllDocentes] = useState([])
  const [allSchedules, setAllSchedules] = useState([])
  const [docenteFilter, setDocenteFilter] = useState('')
  const [periodId, setPeriodId] = useState('')
  const [docenteId, setDocenteId] = useState('')
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState(null)
  const [error, setError] = useState('')
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    let mounted = true
    Promise.all([
      db.periodos.toArray(),
      db.docentes.toArray(),
      db.schedules.toArray(),
    ])
      .then(([p, d, s]) => {
        if (mounted) {
          setPeriodos(p.filter(x => x.active))
          setAllDocentes(d.filter(x => x.active))
          setAllSchedules(s)
        }
      })
      .finally(() => { if (mounted) setFetching(false) })
    return () => { mounted = false }
  }, [])

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { if (!periodId) setDocenteId(''); else setDocenteId('') }, [periodId])

  const professorIdsByPeriod = useMemo(() => {
    const map = new Map()
    for (const s of allSchedules) {
      if (!s.active) continue
      if (!map.has(s.period_id)) map.set(s.period_id, new Set())
      map.get(s.period_id).add(s.professor_id)
    }
    return map
  }, [allSchedules])

  const docentes = useMemo(() => {
    if (!periodId) return allDocentes
    const ids = professorIdsByPeriod.get(periodId)
    if (!ids) return []
    return allDocentes.filter(d => ids.has(d.id))
  }, [allDocentes, periodId, professorIdsByPeriod])

  const filteredDocentes = docentes.filter(d => {
    if (!docenteFilter) return true
    const q = docenteFilter.toLowerCase()
    return (
      d.ci.toLowerCase().includes(q) ||
      d.name.toLowerCase().includes(q) ||
      d.lastname.toLowerCase().includes(q) ||
      (d.surname && d.surname.toLowerCase().includes(q))
    )
  })

  const effectiveDocenteId = docentes.find(d => d.id === docenteId) ? docenteId : ''

  const activePeriodos = periodos.filter(p => p.active)

  async function handleGenerate() {
    if (!periodId) return
    setLoading(true)
    setError('')
    setReport(null)
    try {
      const data = await honorarioService.generate(periodId, effectiveDocenteId || null)
      setReport(data)
    } catch (err) {
      setError(err.message || 'Error al generar el reporte')
    } finally {
      setLoading(false)
    }
  }

  function formatDate(dateStr) {
    const [y, m, d] = dateStr.split('-')
    return `${d}/${m}/${y}`
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Honorarios</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Reporte de honorarios por docente y periodo académico
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Periodo académico
            </label>
            <select
              value={periodId}
              onChange={e => setPeriodId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Seleccione un periodo</option>
              {activePeriodos.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Docente <span className="text-xs text-gray-400">(opcional — vacío = todos)</span>
            </label>
            <input
              type="text"
              placeholder="Buscar por CI o nombre..."
              value={docenteFilter}
              onChange={e => { setDocenteFilter(e.target.value); setDocenteId('') }}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2"
            />
            <select
              value={effectiveDocenteId}
              onChange={e => setDocenteId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">— Todos los docentes —</option>
              {filteredDocentes.map(d => (
                <option key={d.id} value={d.id}>
                  {d.ci} — {d.name} {d.lastname}{d.surname ? ' ' + d.surname : ''}
                </option>
              ))}
            </select>
            {filteredDocentes.length === 0 && docenteFilter && (
              <p className="text-xs text-gray-400 mt-1">Sin resultados</p>
            )}
          </div>

          <div className="flex items-end">
            <button
              onClick={handleGenerate}
              disabled={!periodId || loading}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              )}
              Generar reporte
            </button>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Loading overlay */}
      {loading && (
        <div className="flex items-center justify-center py-24">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Generando reporte...</p>
          </div>
        </div>
      )}

      {/* Report */}
      {report && !loading && report.teachers.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-center h-32 text-gray-400 dark:text-gray-500 text-sm">
            No hay horarios registrados en este periodo
          </div>
        </div>
      )}

      {report && !loading && report.teachers.length > 0 && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Periodo: <span className="font-semibold text-gray-700 dark:text-gray-200">{report.periodName}</span>
              {' | '}Pago por hora: <span className="font-semibold text-gray-700 dark:text-gray-200">Bs {report.formatCurrency(report.payPerHour)}</span>
              {' | '}Pago por minuto: <span className="font-semibold text-gray-700 dark:text-gray-200">Bs {report.formatCurrency(report.payPerMinute)}</span>
            </div>
            {report.teachers.length > 0 && (
              <PDFDownloadLink
                document={<HonorarioPDF report={report} />}
                fileName={`honorarios-${report.periodName.replace(/\s+/g, '_')}.pdf`}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                {({ loading: pdfLoading }) => (
                  <span className="flex items-center gap-2">
                    {pdfLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />}
                    {pdfLoading ? 'Generando PDF...' : 'Exportar PDF'}
                  </span>
                )}
              </PDFDownloadLink>
            )}
          </div>

          {report.teachers.map(teacher => (
            <div key={teacher.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {teacher.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">CI: {teacher.ci}</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-900/30 text-left text-xs text-gray-500 dark:text-gray-400 uppercase">
                      <th className="px-3 py-2 font-medium">Fecha</th>
                      <th className="px-3 py-2 font-medium">Día</th>
                      <th className="px-3 py-2 font-medium">Asignatura</th>
                      <th className="px-3 py-2 font-medium text-center">Entrada</th>
                      <th className="px-3 py-2 font-medium text-center">Salida</th>
                      <th className="px-3 py-2 font-medium text-right">Minutos</th>
                      <th className="px-3 py-2 font-medium text-right">$/hora</th>
                      <th className="px-3 py-2 font-medium text-right">$/min</th>
                      <th className="px-3 py-2 font-medium text-right">Pagado (Bs)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {teacher.entries.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="px-3 py-8 text-center text-gray-400">
                          Sin horarios registrados en este periodo
                        </td>
                      </tr>
                    ) : (
                      teacher.entries.map((entry, ei) =>
                        entry.schedules.map((sch, si) => (
                          <tr key={`${ei}-${si}`} className="hover:bg-gray-50 dark:hover:bg-gray-700/20">
                            {si === 0 && (
                              <>
                                <td className="px-3 py-2 text-gray-900 dark:text-white whitespace-nowrap" rowSpan={entry.schedules.length}>
                                  {formatDate(entry.date)}
                                </td>
                                <td className="px-3 py-2 text-gray-600 dark:text-gray-400 capitalize whitespace-nowrap" rowSpan={entry.schedules.length}>
                                  {entry.dayName}
                                </td>
                              </>
                            )}
                            <td className="px-3 py-2 text-gray-900 dark:text-white">{sch.subjectName}</td>
                            <td className="px-3 py-2 text-center text-gray-600 dark:text-gray-400">{sch.startAt}</td>
                            <td className="px-3 py-2 text-center text-gray-600 dark:text-gray-400">{sch.endAt}</td>
                            <td className="px-3 py-2 text-right text-gray-900 dark:text-white tabular-nums">{sch.minutes}</td>
                            <td className="px-3 py-2 text-right text-gray-600 dark:text-gray-400 tabular-nums">{report.formatCurrency(sch.payPerHour)}</td>
                            <td className="px-3 py-2 text-right text-gray-600 dark:text-gray-400 tabular-nums">{report.formatCurrency(sch.payPerMinute)}</td>
                            <td className="px-3 py-2 text-right font-medium text-gray-900 dark:text-white tabular-nums">{report.formatCurrency(sch.pay)}</td>
                          </tr>
                        ))
                      )
                    )}
                  </tbody>
                  {teacher.entries.length > 0 && (
                    <tfoot>
                      <tr className="bg-indigo-50 dark:bg-indigo-900/20 font-semibold text-sm">
                        <td colSpan={5} className="px-3 py-2 text-right text-gray-700 dark:text-gray-300">
                          Total {teacher.name}
                        </td>
                        <td className="px-3 py-2 text-right text-gray-900 dark:text-white tabular-nums">
                          {teacher.totalMinutes}
                        </td>
                        <td colSpan={2}></td>
                        <td className="px-3 py-2 text-right text-indigo-700 dark:text-indigo-300 tabular-nums">
                          Bs {report.formatCurrency(teacher.totalPay)}
                        </td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </div>
          ))}

          {/* Grand total */}
          {report.teachers.length > 1 && (
            <div className="bg-indigo-600 dark:bg-indigo-500 rounded-xl shadow-sm px-6 py-4 text-white">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">Total general pagado</span>
                <span className="text-2xl font-bold">Bs {report.formatCurrency(report.grandTotal)}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {!report && !loading && !error && !fetching && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-center h-48 text-gray-400 dark:text-gray-500 text-sm">
            Seleccione un periodo y genere el reporte
          </div>
        </div>
      )}
    </div>
  )
}