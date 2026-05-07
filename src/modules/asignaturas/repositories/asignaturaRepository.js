import db from '../../../database/db'

export const asignaturaRepository = {
  async getAll() {
    return db.asignaturas.orderBy('created_at').reverse().toArray()
  },

  async getById(id) {
    return db.asignaturas.get(id)
  },

  async findByAcronym(acronym) {
    return db.asignaturas.where('acronym').equals(acronym).first()
  },

  async create(data) {
    const now = new Date().toISOString()
    const asignatura = {
      ...data,
      id: crypto.randomUUID(),
      active: true,
      created_at: now,
      updated_at: now,
    }
    await db.asignaturas.add(asignatura)
    return asignatura
  },

  async update(id, data) {
    const updated = {
      ...data,
      updated_at: new Date().toISOString(),
    }
    await db.asignaturas.update(id, updated)
    return this.getById(id)
  },

  async toggleActive(id) {
    const asignatura = await this.getById(id)
    if (!asignatura) throw new Error('Asignatura no encontrada')
    await db.asignaturas.update(id, {
      active: !asignatura.active,
      updated_at: new Date().toISOString(),
    })
    return this.getById(id)
  },
}
