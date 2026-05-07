import { docenteRepository } from '../repositories/docenteRepository'

export const docenteService = {
  async getAll() {
    return docenteRepository.getAll()
  },

  async getById(id) {
    return docenteRepository.getById(id)
  },

  async create(data) {
    return docenteRepository.create(data)
  },

  async update(id, data) {
    return docenteRepository.update(id, data)
  },

  async toggleActive(id) {
    return docenteRepository.toggleActive(id)
  },
}
