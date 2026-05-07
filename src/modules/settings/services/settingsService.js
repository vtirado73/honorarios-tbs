import { settingsRepository } from '../repositories/settingsRepository'

const MONEY_REGEX = /^\d+(\.\d{2})?$/

const SHIFT_FIELDS = [
  { start: 'morning_start', end: 'morning_end', label: 'mañana' },
  { start: 'afternoon_start', end: 'afternoon_end', label: 'tarde' },
  { start: 'evening_start', end: 'evening_end', label: 'noche' },
]

const TIME_REGEX = /^\d{2}:\d{2}$/

export const settingsService = {
  async get() {
    return settingsRepository.get()
  },

  async update(id, data) {
    if (!MONEY_REGEX.test(data.pay_per_hour)) {
      throw new Error('El monto debe ser un número entero o con 2 decimales (ej: 150 o 150.00)')
    }

    for (const shift of SHIFT_FIELDS) {
      const start = data[shift.start]
      const end = data[shift.end]

      if (!TIME_REGEX.test(start) || !TIME_REGEX.test(end)) {
        throw new Error(`Formato de hora inválido en turno ${shift.label}`)
      }

      if (start >= end) {
        throw new Error(`La hora de inicio del turno ${shift.label} debe ser menor a la de fin`)
      }
    }

    return settingsRepository.update(id, data)
  },
}
