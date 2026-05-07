import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { scheduleService } from '../../modules/schedules/services/scheduleService'
import ScheduleForm from '../../modules/schedules/components/ScheduleForm'
import WeeklyCalendar from '../../modules/schedules/components/WeeklyCalendar'
import db from '../../database/db'

export default function ScheduleRegistro() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [docentes, setDocentes] = useState([])
  const [asignaturas, setAsignaturas] = useState([])
  const [carreras, setCarreras] = useState([])
  const [periodos, setPeriodos] = useState([])
  const [fetching, setFetching] = useState(true)

  const [selectedPeriodId, setSelectedPeriodId] = useState('')
  const [calendarLoaded, setCalendarLoaded] = useState({ periodId: null, data: [] })

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
  const calendarSchedules = calendarLoading ? [] : calendarLoaded.data

  function handlePeriodChange(periodId) {
    setSelectedPeriodId(periodId)
  }

  async function handleSubmit(data) {
    try {
      setLoading(true)
      await scheduleService.create(data)
      navigate(-1)
    } catch (err) {
      if (typeof err === 'object' && !(err instanceof Error)) {
        return
      }
      alert('Ocurrió un error al guardar el horario')
    } finally {
      setLoading(false)
    }
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Nuevo Horario</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Registrar un nuevo horario de clase</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-[400px] shrink-0">
          <ScheduleForm
            docentes={docentes}
            asignaturas={asignaturas}
            carreras={carreras}
            periodos={periodos}
            periodId={selectedPeriodId}
            onPeriodChange={handlePeriodChange}
            onSubmit={handleSubmit}
            onCancel={() => navigate(-1)}
            loading={loading}
          />
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Calendario semanal
            {!selectedPeriodId && (
              <span className="ml-2 text-xs font-normal text-gray-400">
                (seleccione un periodo para ver los horarios existentes)
              </span>
            )}
          </h2>
          <WeeklyCalendar
            schedules={calendarSchedules}
            loading={calendarLoading}
          />
        </div>
      </div>
    </div>
  )
}
