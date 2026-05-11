import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { scheduleService } from '../../modules/schedules/services/scheduleService'
import { printSchedule } from '../../modules/schedules/utils/printSchedule.jsx'
import ScheduleForm from '../../modules/schedules/components/ScheduleForm'
import db from '../../database/db'

export default function ScheduleEditar() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [printLoading, setPrintLoading] = useState(false)
  const [schedule, setSchedule] = useState(null)
  const [docentes, setDocentes] = useState([])
  const [asignaturas, setAsignaturas] = useState([])
  const [carreras, setCarreras] = useState([])
  const [periodos, setPeriodos] = useState([])

  useEffect(() => {
    let mounted = true

    Promise.all([
      scheduleService.getById(id),
      db.docentes.toArray(),
      db.asignaturas.toArray(),
      db.periodos.toArray(),
      db.carreras.toArray(),
    ])
      .then(([s, d, a, p, c]) => {
        if (mounted) {
          if (!s) {
            alert('Horario no encontrado')
            navigate(-1)
            return
          }
          setSchedule(s)
          setDocentes(d)
          setAsignaturas(a)
          setPeriodos(p)
          setCarreras(c)
        }
      })
      .catch(() => { if (mounted) alert('Error al cargar el horario'); navigate(-1) })
      .finally(() => { if (mounted) setFetching(false) })

    return () => { mounted = false }
  }, [id, navigate])

  async function handleSubmit(data) {
    try {
      setLoading(true)
      await scheduleService.update(id, data)
      navigate(-1)
    } catch {
      alert('Ocurrió un error al actualizar el horario')
    } finally {
      setLoading(false)
    }
  }

  async function handlePrint() {
    if (!schedule) return
    const teacher = docentes.find(d => d.id === schedule.professor_id)
    const period = periodos.find(p => p.id === schedule.period_id)
    if (!teacher || !period) return

    try {
      setPrintLoading(true)
      const all = await scheduleService.getByPeriodEnriched(schedule.period_id)
      const teacherSchedules = all.filter(s => s.professor_id === schedule.professor_id)
      printSchedule({ teacher, period, schedules: teacherSchedules })
    } catch {
      alert('Error al cargar horarios para imprimir')
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Editar Horario</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Modificar horario de clase</p>
          </div>
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
        </div>
      </div>

      <ScheduleForm
        key={schedule.id}
        initialData={schedule}
        docentes={docentes}
        asignaturas={asignaturas}
        carreras={carreras}
        periodos={periodos}
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
        loading={loading}
      />
    </div>
  )
}
