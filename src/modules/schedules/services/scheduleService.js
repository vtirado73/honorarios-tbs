import { scheduleRepository } from '../repositories/scheduleRepository'
import db from '../../../database/db'

const DAYS = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']
const SHIFTS = ['mañana', 'tarde', 'noche']

function isValidTime(value) {
  return /^\d{2}:\d{2}$/.test(value)
}

export const scheduleService = {
  async getAll() {
    return scheduleRepository.getAll()
  },

  async getByPeriod(periodId) {
    return scheduleRepository.getByPeriod(periodId)
  },

  async getByPeriodEnriched(periodId) {
    const schedules = await scheduleRepository.getByPeriod(periodId)
    const [docentes, asignaturas] = await Promise.all([
      db.docentes.toArray(),
      db.asignaturas.toArray(),
    ])

    const docenteMap = Object.fromEntries(
      docentes.map(d => [d.id, `${d.name} ${d.lastname}${d.surname ? ' ' + d.surname : ''}`])
    )
    const asignaturaMap = Object.fromEntries(
      asignaturas.map(a => [a.id, { name: `${a.name} (${a.acronym})`, acronym: a.acronym }])
    )

    return schedules.map(s => ({
      ...s,
      professor_name: docenteMap[s.professor_id] || '—',
      subject_name: asignaturaMap[s.subject_id]?.name || '—',
      subject_acronym: asignaturaMap[s.subject_id]?.acronym || '',
    }))
  },

  async getAllEnriched() {
    const [schedules, docentes, asignaturas, periodos] = await Promise.all([
      scheduleRepository.getAll(),
      db.docentes.toArray(),
      db.asignaturas.toArray(),
      db.periodos.toArray(),
    ])

    const docenteMap = Object.fromEntries(
      docentes.map(d => [d.id, `${d.name} ${d.lastname}${d.surname ? ' ' + d.surname : ''}`])
    )
    const asignaturaMap = Object.fromEntries(
      asignaturas.map(a => [a.id, `${a.name} (${a.acronym})`])
    )
    const periodoMap = Object.fromEntries(
      periodos.map(p => [p.id, p.name])
    )

    return schedules.map(s => ({
      ...s,
      professor_name: docenteMap[s.professor_id] || '—',
      subject_name: asignaturaMap[s.subject_id] || '—',
      period_name: periodoMap[s.period_id] || '—',
    }))
  },

  async getById(id) {
    return scheduleRepository.getById(id)
  },

  validate(data) {
    const errors = {}

    if (!data.professor_id) errors.professor_id = 'Debe seleccionar un docente'
    if (!data.subject_id) errors.subject_id = 'Debe seleccionar una asignatura'
    if (!data.period_id) errors.period_id = 'Debe seleccionar un periodo'
    if (!data.day) errors.day = 'Debe seleccionar un día'
    if (!DAYS.includes(data.day)) errors.day = 'Día inválido'

    if (!data.start_at) {
      errors.start_at = 'Debe ingresar la hora de inicio'
    } else if (!isValidTime(data.start_at)) {
      errors.start_at = 'Formato de hora inválido'
    }

    if (!data.end_at) {
      errors.end_at = 'Debe ingresar la hora de fin'
    } else if (!isValidTime(data.end_at)) {
      errors.end_at = 'Formato de hora inválido'
    }

    if (data.start_at && data.end_at && data.start_at >= data.end_at) {
      errors.end_at = 'La hora de fin debe ser mayor a la hora de inicio'
    }

    if (!data.shift) {
      errors.shift = 'Debe seleccionar un turno'
    } else if (!SHIFTS.includes(data.shift)) {
      errors.shift = 'Turno inválido'
    }

    return errors
  },

  async create(data) {
    const errors = this.validate(data)
    if (Object.keys(errors).length > 0) throw errors
    return scheduleRepository.create(data)
  },

  async update(id, data) {
    const errors = this.validate(data)
    if (Object.keys(errors).length > 0) throw errors
    return scheduleRepository.update(id, data)
  },

  async toggleActive(id) {
    return scheduleRepository.toggleActive(id)
  },

  async createMany(dataArray) {
    const now = new Date().toISOString()
    const entries = dataArray.map(data => ({
      ...data,
      id: crypto.randomUUID(),
      active: true,
      created_at: now,
      updated_at: now,
    }))
    return scheduleRepository.createMany(entries)
  },
}
