import db from '../../../database/db'

export const carreraRepository = {
  async getAll() {
    return db.carreras.orderBy('created_at').reverse().toArray()
  },

  async getById(id) {
    return db.carreras.get(id)
  },

  async findByAcronym(acronym) {
    return db.carreras.where('acronym').equals(acronym).first()
  },

  async create(data) {
    const now = new Date().toISOString()
    const carrera = {
      ...data,
      id: crypto.randomUUID(),
      active: true,
      created_at: now,
      updated_at: now,
    }
    await db.carreras.add(carrera)
    return carrera
  },

  async update(id, data) {
    const updated = {
      ...data,
      updated_at: new Date().toISOString(),
    }
    await db.carreras.update(id, updated)
    return this.getById(id)
  },

  async toggleActive(id) {
    const carrera = await this.getById(id)
    if (!carrera) throw new Error('Carrera no encontrada')
    await db.carreras.update(id, {
      active: !carrera.active,
      updated_at: new Date().toISOString(),
    })
    return this.getById(id)
  },
}
