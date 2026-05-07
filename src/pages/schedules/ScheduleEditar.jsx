import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { scheduleService } from '../../modules/schedules/services/scheduleService'
import ScheduleForm from '../../modules/schedules/components/ScheduleForm'
import db from '../../database/db'

export default function ScheduleEditar() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [schedule, setSchedule] = useState(null)
  const [docentes, setDocentes] = useState([])
  const [asignaturas, setAsignaturas] = useState([])
  const [periodos, setPeriodos] = useState([])

  useEffect(() => {
    let mounted = true

    Promise.all([
      scheduleService.getById(id),
      db.docentes.toArray(),
      db.asignaturas.toArray(),
      db.periodos.toArray(),
    ])
      .then(([s, d, a, p]) => {
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Editar Horario</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Modificar horario de clase</p>
      </div>

      <ScheduleForm
        key={schedule.id}
        initialData={schedule}
        docentes={docentes}
        asignaturas={asignaturas}
        periodos={periodos}
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
        loading={loading}
      />
    </div>
  )
}
