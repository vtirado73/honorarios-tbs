import db from '../../../database/db'

export const periodoRepository = {
  async getAll() {
    return db.periodos.orderBy('created_at').reverse().toArray()
  },

  async getById(id) {
    return db.periodos.get(id)
  },

  async create(data) {
    const now = new Date().toISOString()
    const periodo = {
      ...data,
      id: crypto.randomUUID(),
      active: true,
      created_at: now,
      updated_at: now,
    }
    await db.periodos.add(periodo)
    return periodo
  },

  async update(id, data) {
    const updated = {
      ...data,
      updated_at: new Date().toISOString(),
    }
    await db.periodos.update(id, updated)
    return this.getById(id)
  },

  async toggleActive(id) {
    const periodo = await this.getById(id)
    if (!periodo) throw new Error('Periodo no encontrado')
    await db.periodos.update(id, {
      active: !periodo.active,
      updated_at: new Date().toISOString(),
    })
    return this.getById(id)
  },
}
