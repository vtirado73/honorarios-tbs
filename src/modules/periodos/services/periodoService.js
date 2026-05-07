import { periodoRepository } from '../repositories/periodoRepository'

export const periodoService = {
  async getAll() {
    return periodoRepository.getAll()
  },

  async getById(id) {
    return periodoRepository.getById(id)
  },

  async create(data) {
    if (data.start_at && data.end_at && data.start_at > data.end_at) {
      throw new Error('La fecha de inicio no puede ser mayor a la fecha de fin')
    }
    return periodoRepository.create(data)
  },

  async update(id, data) {
    if (data.start_at && data.end_at && data.start_at > data.end_at) {
      throw new Error('La fecha de inicio no puede ser mayor a la fecha de fin')
    }
    return periodoRepository.update(id, data)
  },

  async toggleActive(id) {
    return periodoRepository.toggleActive(id)
  },
}
