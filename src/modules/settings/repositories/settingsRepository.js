import db from '../../../database/db'

const SHIFT_DEFAULTS = {
  morning_start: '07:00',
  morning_end: '14:00',
  afternoon_start: '14:00',
  afternoon_end: '19:00',
  evening_start: '19:00',
  evening_end: '22:00',
}

export const settingsRepository = {
  async get() {
    const records = await db.settings.toArray()
    if (records.length === 0) {
      const now = new Date().toISOString()
      const setting = {
        id: crypto.randomUUID(),
        pay_per_hour: '0',
        ...SHIFT_DEFAULTS,
        active: true,
        created_at: now,
        updated_at: now,
      }
      await db.settings.add(setting)
      return setting
    }
    return records[0]
  },

  async update(id, data) {
    const updated = {
      ...data,
      updated_at: new Date().toISOString(),
    }
    await db.settings.update(id, updated)
    const result = await db.settings.get(id)
    return result
  },
}
