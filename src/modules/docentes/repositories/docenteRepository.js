import db from '../../../database/db'

export const docenteRepository = {
  async getAll() {
    return db.docentes.orderBy('created_at').reverse().toArray()
  },

  async getById(id) {
    return db.docentes.get(id)
  },

  async create(data) {
    const now = new Date().toISOString()
    const docente = {
      ...data,
      id: crypto.randomUUID(),
      active: true,
      created_at: now,
      updated_at: now,
    }
    await db.docentes.add(docente)
    return docente
  },

  async update(id, data) {
    const updated = {
      ...data,
      updated_at: new Date().toISOString(),
    }
    await db.docentes.update(id, updated)
    return this.getById(id)
  },

  async toggleActive(id) {
    const docente = await this.getById(id)
    if (!docente) throw new Error('Docente no encontrado')
    await db.docentes.update(id, {
      active: !docente.active,
      updated_at: new Date().toISOString(),
    })
    return this.getById(id)
  },
}
