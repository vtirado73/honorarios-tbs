import { useState } from 'react'

const DAYS = [
  { value: 'lunes', label: 'Lunes' },
  { value: 'martes', label: 'Martes' },
  { value: 'miércoles', label: 'Miércoles' },
  { value: 'jueves', label: 'Jueves' },
  { value: 'viernes', label: 'Viernes' },
  { value: 'sábado', label: 'Sábado' },
]

const SHIFTS = [
  { value: 'mañana', label: 'Mañana' },
  { value: 'tarde', label: 'Tarde' },
  { value: 'noche', label: 'Noche' },
]

export default function ScheduleForm({
  initialData,
  docentes,
  asignaturas,
  periodos,
  onSubmit,
  onCancel,
  loading,
  periodId: controlledPeriodId,
  onPeriodChange,
}) {
  const [professorId, setProfessorId] = useState(() => initialData?.professor_id ?? '')
  const [subjectId, setSubjectId] = useState(() => initialData?.subject_id ?? '')
  const [internalPeriodId, setInternalPeriodId] = useState(() => initialData?.period_id ?? '')

  const periodId = controlledPeriodId ?? internalPeriodId

  function handlePeriodChange(e) {
    const value = e.target.value
    if (onPeriodChange) {
      onPeriodChange(value)
    }
    setInternalPeriodId(value)
    clearError('periodId')
  }
  const [day, setDay] = useState(() => initialData?.day ?? '')
  const [startAt, setStartAt] = useState(() => initialData?.start_at ?? '')
  const [endAt, setEndAt] = useState(() => initialData?.end_at ?? '')
  const [shift, setShift] = useState(() => initialData?.shift ?? '')
  const [errors, setErrors] = useState({})

  const activeDocentes = docentes.filter(d => d.active)
  const activeAsignaturas = asignaturas.filter(a => a.active)
  const activePeriodos = periodos.filter(p => p.active)

  function validate() {
    const errs = {}
    if (!professorId) errs.professorId = 'Debe seleccionar un docente'
    if (!subjectId) errs.subjectId = 'Debe seleccionar una asignatura'
    if (!periodId) errs.periodId = 'Debe seleccionar un periodo'
    if (!day) errs.day = 'Debe seleccionar un día'
    if (!startAt) errs.startAt = 'Debe ingresar la hora de inicio'
    if (!endAt) {
      errs.endAt = 'Debe ingresar la hora de fin'
    } else if (startAt && endAt && startAt >= endAt) {
      errs.endAt = 'Debe ser mayor a la hora de inicio'
    }
    if (!shift) errs.shift = 'Debe seleccionar un turno'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function clearError(field) {
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n })
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    onSubmit({
      professor_id: professorId,
      subject_id: subjectId,
      period_id: periodId,
      day,
      start_at: startAt,
      end_at: endAt,
      shift,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Docente <span className="text-red-500">*</span>
          </label>
          <select
            value={professorId}
            onChange={e => { setProfessorId(e.target.value); clearError('professorId') }}
            className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors ${
              errors.professorId
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500'
            }`}
          >
            <option value="">Seleccione un docente</option>
            {activeDocentes.map(d => (
              <option key={d.id} value={d.id}>
                {d.name} {d.lastname}{d.surname ? ' ' + d.surname : ''}
              </option>
            ))}
          </select>
          {errors.professorId && <p className="text-sm text-red-500 mt-1">{errors.professorId}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Asignatura <span className="text-red-500">*</span>
          </label>
          <select
            value={subjectId}
            onChange={e => { setSubjectId(e.target.value); clearError('subjectId') }}
            className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors ${
              errors.subjectId
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500'
            }`}
          >
            <option value="">Seleccione una asignatura</option>
            {activeAsignaturas.map(a => (
              <option key={a.id} value={a.id}>{a.name} ({a.acronym})</option>
            ))}
          </select>
          {errors.subjectId && <p className="text-sm text-red-500 mt-1">{errors.subjectId}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Periodo académico <span className="text-red-500">*</span>
          </label>
          <select
            value={periodId}
            onChange={handlePeriodChange}
            className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors ${
              errors.periodId
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500'
            }`}
          >
            <option value="">Seleccione un periodo</option>
            {activePeriodos.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          {errors.periodId && <p className="text-sm text-red-500 mt-1">{errors.periodId}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Día <span className="text-red-500">*</span>
            </label>
            <select
              value={day}
              onChange={e => { setDay(e.target.value); clearError('day') }}
              className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors ${
                errors.day
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500'
              }`}
            >
              <option value="">Seleccione un día</option>
              {DAYS.map(d => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
            {errors.day && <p className="text-sm text-red-500 mt-1">{errors.day}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Turno <span className="text-red-500">*</span>
            </label>
            <select
              value={shift}
              onChange={e => { setShift(e.target.value); clearError('shift') }}
              className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors ${
                errors.shift
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500'
              }`}
            >
              <option value="">Seleccione un turno</option>
              {SHIFTS.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            {errors.shift && <p className="text-sm text-red-500 mt-1">{errors.shift}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Hora inicio <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              value={startAt}
              onChange={e => { setStartAt(e.target.value); clearError('startAt') }}
              className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors ${
                errors.startAt
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500'
              }`}
            />
            {errors.startAt && <p className="text-sm text-red-500 mt-1">{errors.startAt}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Hora fin <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              value={endAt}
              onChange={e => { setEndAt(e.target.value); clearError('endAt') }}
              className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors ${
                errors.endAt
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500'
              }`}
            />
            {errors.endAt && <p className="text-sm text-red-500 mt-1">{errors.endAt}</p>}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  )
}
