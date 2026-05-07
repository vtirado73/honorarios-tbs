import { asignaturaRepository } from '../repositories/asignaturaRepository'

export const asignaturaService = {
  async getAll() {
    return asignaturaRepository.getAll()
  },

  async getById(id) {
    return asignaturaRepository.getById(id)
  },

  async create(data) {
    const existing = await asignaturaRepository.findByAcronym(data.acronym)
    if (existing) throw new Error('Ya existe una asignatura con esa sigla')
    return asignaturaRepository.create(data)
  },

  async update(id, data) {
    const existing = await asignaturaRepository.findByAcronym(data.acronym)
    if (existing && existing.id !== id) {
      throw new Error('Ya existe otra asignatura con esa sigla')
    }
    return asignaturaRepository.update(id, data)
  },

  async toggleActive(id) {
    return asignaturaRepository.toggleActive(id)
  },
}
