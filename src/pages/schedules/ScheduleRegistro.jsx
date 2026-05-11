import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import { scheduleService } from '../../modules/schedules/services/scheduleService'
import { printSchedule } from '../../modules/schedules/utils/printSchedule.jsx'
import ScheduleForm from '../../modules/schedules/components/ScheduleForm'
import WeeklyCalendar from '../../modules/schedules/components/WeeklyCalendar'
import db from '../../database/db'

export default function ScheduleRegistro() {
  const navigate = useNavigate()
  const location = useLocation()
  const editGroup = location.state?.editGroup

  const [loading, setLoading] = useState(false)
  const [printLoading, setPrintLoading] = useState(false)
  const [docentes, setDocentes] = useState([])
  const [asignaturas, setAsignaturas] = useState([])
  const [carreras, setCarreras] = useState([])
  const [periodos, setPeriodos] = useState([])
  const [fetching, setFetching] = useState(true)

  const [selectedPeriodId, setSelectedPeriodId] = useState(editGroup?.periodId ?? '')
  const [calendarLoaded, setCalendarLoaded] = useState({ periodId: null, data: [] })
  const [selectedCells, setSelectedCells] = useState(new Set())
  const [replaceTargets, setReplaceTargets] = useState(new Set())
  const [deleteTargets, setDeleteTargets] = useState(new Set())
  const [formReady, setFormReady] = useState(null)

  useEffect(() => {
    let mounted = true

    Promise.all([
      db.docentes.toArray(),
      db.asignaturas.toArray(),
      db.periodos.toArray(),
      db.carreras.toArray(),
    ])
      .then(([d, a, p, c]) => {
        if (mounted) {
          setDocentes(d)
          setAsignaturas(a)
          setPeriodos(p)
          setCarreras(c)
        }
      })
      .finally(() => { if (mounted) setFetching(false) })

    return () => { mounted = false }
  }, [])

  useEffect(() => {
    if (!selectedPeriodId) return

    let mounted = true

    scheduleService.getByPeriodEnriched(selectedPeriodId)
      .then(data => { if (mounted) setCalendarLoaded({ periodId: selectedPeriodId, data }) })
      .catch(() => { if (mounted) setCalendarLoaded({ periodId: selectedPeriodId, data: [] }) })

    return () => { mounted = false }
  }, [selectedPeriodId])

  const calendarLoading = selectedPeriodId !== '' && calendarLoaded.periodId !== selectedPeriodId
  const allCalendarSchedules = calendarLoading ? [] : calendarLoaded.data
  const filteredSchedules = formReady?.professorId
    ? allCalendarSchedules.filter(s => s.professor_id === formReady.professorId)
    : []

  const interactive = !!formReady

  const onToggleCell = useCallback((day, start_at, end_at) => {
    const key = `${day}|${start_at}|${end_at}|`
    setSelectedCells(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }, [])

  const onToggleReplace = useCallback((scheduleId) => {
    setDeleteTargets(prev => {
      const next = new Set(prev)
      next.delete(scheduleId)
      return next
    })
    setReplaceTargets(prev => {
      const next = new Set(prev)
      if (next.has(scheduleId)) next.delete(scheduleId)
      else next.add(scheduleId)
      return next
    })
  }, [])

  const onToggleDelete = useCallback((scheduleId) => {
    setReplaceTargets(prev => {
      const next = new Set(prev)
      next.delete(scheduleId)
      return next
    })
    setDeleteTargets(prev => {
      const next = new Set(prev)
      if (next.has(scheduleId)) next.delete(scheduleId)
      else next.add(scheduleId)
      return next
    })
  }, [])

  function handlePeriodChange(periodId) {
    setSelectedPeriodId(periodId)
    setReplaceTargets(new Set())
    setDeleteTargets(new Set())
  }

  const handleReadyChange = useCallback(ready => {
    setFormReady(ready)
  }, [])

  async function handleSubmit(data) {
    try {
      setLoading(true)

      const subjectId = formReady?.subjectId

      // 1. Delete marked schedules
      if (deleteTargets.size > 0) {
        await Promise.all(Array.from(deleteTargets).map(id => scheduleService.deletePermanently(id)))
      }

      // 2. Replace marked schedules
      if (replaceTargets.size > 0 && subjectId) {
        await Promise.all(
          Array.from(replaceTargets).map(id => scheduleService.replaceSubject(id, subjectId))
        )
      }

      // 3. Create new entries
      const entries = Array.isArray(data) ? data : [data]
      if (entries.length > 0) await scheduleService.createMany(entries)

      // Refresh calendar and reset selections
      const refreshed = await scheduleService.getByPeriodEnriched(selectedPeriodId)
      setCalendarLoaded({ periodId: selectedPeriodId, data: refreshed })
      setSelectedCells(new Set())
      setReplaceTargets(new Set())
      setDeleteTargets(new Set())
    } catch (err) {
      if (typeof err === 'object' && !(err instanceof Error)) {
        return
      }
      alert('Ocurrió un error al guardar los horarios')
    } finally {
      setLoading(false)
    }
  }

  async function handlePrint() {
    const teacher = docentes.find(d => d.id === formReady?.professorId)
    const period = periodos.find(p => p.id === selectedPeriodId)
    if (!teacher || !period || filteredSchedules.length === 0) return
    try {
      setPrintLoading(true)
      await printSchedule({ teacher, period, schedules: filteredSchedules })
    } catch {
      alert('Error al generar el PDF')
    } finally {
      setPrintLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {editGroup ? 'Editar Horarios' : 'Nuevo Horario'}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {editGroup ? 'Modificar horarios de clase del grupo seleccionado' : 'Registrar un nuevo horario de clase'}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-[400px] shrink-0">
          <ScheduleForm
            docentes={docentes}
            asignaturas={asignaturas}
            carreras={carreras}
            periodos={periodos}
            defaultValues={editGroup ? { professorId: editGroup.professorId, subjectId: editGroup.subjectId, periodId: editGroup.periodId } : undefined}
            selectedCells={selectedCells}
            periodId={selectedPeriodId}
            onPeriodChange={handlePeriodChange}
            onReadyChange={handleReadyChange}
            onSubmit={handleSubmit}
            onCancel={() => navigate(-1)}
            loading={loading}
            locked={!!editGroup}
            hasPendingChanges={replaceTargets.size > 0 || deleteTargets.size > 0}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Calendario semanal
              {!selectedPeriodId && (
                <span className="ml-2 text-xs font-normal text-gray-400">
                  (seleccione un periodo para ver los horarios existentes)
                </span>
              )}
            </h2>
            {filteredSchedules.length > 0 && (
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
          <WeeklyCalendar
            schedules={filteredSchedules}
            loading={calendarLoading || loading}
            interactive={interactive}
            selectedCells={selectedCells}
            replaceTargets={replaceTargets}
            deleteTargets={deleteTargets}
            onToggleCell={onToggleCell}
            onToggleReplace={onToggleReplace}
            onToggleDelete={onToggleDelete}
            subjectAcronym={formReady?.acronym || ''}
          />
        </div>
      </div>
    </div>
  )
}