import { holidayRepository } from '../repositories/holidayRepository'

export const holidayService = {
  async getAll() {
    return holidayRepository.getAll()
  },

  async getById(id) {
    return holidayRepository.getById(id)
  },

  validate(data) {
    const errors = {}
    if (!data.title || !data.title.trim()) errors.title = 'El título es requerido'
    if (!data.date) errors.date = 'La fecha es requerida'
    return errors
  },

  async create(data) {
    const errors = this.validate(data)
    if (Object.keys(errors).length > 0) throw errors
    return holidayRepository.create(data)
  },

  async update(id, data) {
    const errors = this.validate(data)
    if (Object.keys(errors).length > 0) throw errors
    return holidayRepository.update(id, data)
  },

  async toggleActive(id) {
    return holidayRepository.toggleActive(id)
  },
}