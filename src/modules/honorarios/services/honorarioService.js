import db from '../../../database/db'
import { settingsService } from '../../settings/services/settingsService'

const DAY_NAMES = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']

function parseTime(t) {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

function* dateRange(start, end) {
  let current = new Date(start)
  const endDate = new Date(end)
  while (current <= endDate) {
    yield current.toISOString().slice(0, 10)
    current.setDate(current.getDate() + 1)
  }
}

function formatCurrency(n) {
  return n.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export const honorarioService = {
  async generate(periodId, docenteId) {
    const [period, settings, allSchedules, allSubjects] = await Promise.all([
      db.periodos.get(periodId),
      settingsService.get(),
      db.schedules.where('period_id').equals(periodId).and(s => s.active).toArray(),
      db.asignaturas.toArray(),
    ])

    if (!period) throw new Error('Periodo no encontrado')

    const payPerHour = parseFloat(settings.pay_per_hour) || 0
    const payPerMinute = payPerHour / 60
    const subjectMap = Object.fromEntries(allSubjects.map(a => [a.id, a]))

    let docentes
    if (docenteId) {
      const d = await db.docentes.get(docenteId)
      if (!d) throw new Error('Docente no encontrado')
      docentes = [d]
    } else {
      docentes = await db.docentes.filter(d => d.active).toArray()
    }

    const teachers = docentes.map(docente => {
      const teacherSchedules = allSchedules.filter(s => s.professor_id === docente.id)
      const entries = []

      for (const dateStr of dateRange(period.start_at, period.end_at)) {
        const date = new Date(dateStr + 'T00:00:00')
        const dayName = DAY_NAMES[date.getDay()]
        const daySchedules = teacherSchedules.filter(s => s.day === dayName)

        if (daySchedules.length === 0) continue

        const scheduleRows = daySchedules.map(s => {
          const subject = subjectMap[s.subject_id]
          const minutes = parseTime(s.end_at) - parseTime(s.start_at)
          const pay = minutes * payPerMinute
          return {
            subjectName: subject ? `${subject.name} (${subject.acronym})` : '—',
            subjectAcronym: subject?.acronym || '',
            startAt: s.start_at,
            endAt: s.end_at,
            minutes,
            payPerHour,
            payPerMinute,
            pay,
          }
        })

        scheduleRows.sort((a, b) => {
          const cmp = a.subjectAcronym.localeCompare(b.subjectAcronym)
          if (cmp !== 0) return cmp
          return a.startAt.localeCompare(b.startAt)
        })

        const dayMinutes = scheduleRows.reduce((sum, r) => sum + r.minutes, 0)
        const dayPay = scheduleRows.reduce((sum, r) => sum + r.pay, 0)

        entries.push({
          date: dateStr,
          dayName,
          schedules: scheduleRows,
          dayMinutes,
          dayPay,
        })
      }

      const totalMinutes = entries.reduce((sum, e) => sum + e.dayMinutes, 0)
      const totalPay = entries.reduce((sum, e) => sum + e.dayPay, 0)

      return {
        id: docente.id,
        name: `${docente.name} ${docente.lastname}${docente.surname ? ' ' + docente.surname : ''}`,
        ci: docente.ci,
        entries,
        totalMinutes,
        totalPay,
      }
    })

    const grandTotal = teachers.reduce((sum, t) => sum + t.totalPay, 0)

    return {
      periodName: period.name,
      payPerHour,
      payPerMinute,
      teachers,
      grandTotal,
      formatCurrency,
    }
  },
}