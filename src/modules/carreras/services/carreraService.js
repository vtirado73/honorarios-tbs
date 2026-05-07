import { carreraRepository } from '../repositories/carreraRepository'

export const carreraService = {
  async getAll() {
    return carreraRepository.getAll()
  },

  async getById(id) {
    return carreraRepository.getById(id)
  },

  async create(data) {
    const existing = await carreraRepository.findByAcronym(data.acronym)
    if (existing) throw new Error('Ya existe una carrera con esa sigla')
    return carreraRepository.create(data)
  },

  async update(id, data) {
    const existing = await carreraRepository.findByAcronym(data.acronym)
    if (existing && existing.id !== id) {
      throw new Error('Ya existe otra carrera con esa sigla')
    }
    return carreraRepository.update(id, data)
  },

  async toggleActive(id) {
    return carreraRepository.toggleActive(id)
  },
}
