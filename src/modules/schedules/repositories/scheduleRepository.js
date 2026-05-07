import db from '../../../database/db'

export const scheduleRepository = {
  async getAll() {
    return db.schedules.orderBy('created_at').reverse().toArray()
  },

  async getByPeriod(periodId) {
    return db.schedules.where('period_id').equals(periodId).toArray()
  },

  async getById(id) {
    return db.schedules.get(id)
  },

  async create(data) {
    const now = new Date().toISOString()
    const schedule = {
      ...data,
      id: crypto.randomUUID(),
      active: true,
      created_at: now,
      updated_at: now,
    }
    await db.schedules.add(schedule)
    return schedule
  },

  async update(id, data) {
    const updated = {
      ...data,
      updated_at: new Date().toISOString(),
    }
    await db.schedules.update(id, updated)
    return this.getById(id)
  },

  async toggleActive(id) {
    const schedule = await this.getById(id)
    if (!schedule) throw new Error('Horario no encontrado')
    await db.schedules.update(id, {
      active: !schedule.active,
      updated_at: new Date().toISOString(),
    })
    return this.getById(id)
  },
}
