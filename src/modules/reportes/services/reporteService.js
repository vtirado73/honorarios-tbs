import db from '../../../database/db'
import { scheduleService } from '../../schedules/services/scheduleService'

const NIVELES = Array.from({ length: 12 }, (_, i) => i + 1)

export const reporteService = {
  getNiveles() {
    return NIVELES
  },

  async getPeriodos() {
    return db.periodos.orderBy('start_at').reverse().filter(p => p.active).toArray()
  },

  async getCarreras() {
    return db.carreras.filter(c => c.active).toArray()
  },

  async getAsignaturasPorCarreraYNivel(careerId, nivel) {
    let collection = db.asignaturas.filter(a => a.active)
    if (careerId) collection = collection.filter(a => a.career_id === careerId)
    if (nivel) collection = collection.filter(a => a.nivel === Number(nivel))
    return collection.toArray()
  },

  async getSchedulesPorNivel(periodId, careerId, nivel) {
    if (!periodId || !careerId || !nivel) return { schedules: [], asignaturas: [], docentes: [] }

    const asignaturas = await this.getAsignaturasPorCarreraYNivel(careerId, nivel)
    if (asignaturas.length === 0) return { schedules: [], asignaturas: [], docentes: [] }

    const [all, allDocentes] = await Promise.all([
      scheduleService.getByPeriodEnriched(periodId),
      db.docentes.toArray(),
    ])

    const subjectIds = new Set(asignaturas.map(a => a.id))
    const schedules = all.filter(s => subjectIds.has(s.subject_id) && s.active)

    const activeDocentes = allDocentes.filter(d => d.active)
    return { schedules, asignaturas, docentes: activeDocentes }
  },
}
