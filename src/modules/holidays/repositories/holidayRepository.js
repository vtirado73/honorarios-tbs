import db from '../../../database/db'

export const holidayRepository = {
  async getAll() {
    return db.holidays.orderBy('date').toArray()
  },

  async getById(id) {
    return db.holidays.get(id)
  },

  async create(data) {
    const now = new Date().toISOString()
    const holiday = {
      ...data,
      id: crypto.randomUUID(),
      active: true,
      created_at: now,
      updated_at: now,
    }
    await db.holidays.add(holiday)
    return holiday
  },

  async update(id, data) {
    const updated = {
      ...data,
      updated_at: new Date().toISOString(),
    }
    await db.holidays.update(id, updated)
    return this.getById(id)
  },

  async toggleActive(id) {
    const holiday = await this.getById(id)
    if (!holiday) throw new Error('Feriado no encontrado')
    await db.holidays.update(id, {
      active: !holiday.active,
      updated_at: new Date().toISOString(),
    })
    return this.getById(id)
  },
}