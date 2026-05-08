import db from '../../../database/db'

export const databaseService = {
  async backup() {
    const data = {}
    for (const table of db.tables) {
      data[table.name] = await table.toArray()
    }
    return data
  },

  async restore(data) {
    for (const table of db.tables) {
      await table.clear()
      const records = data[table.name]
      if (records && records.length > 0) {
        await table.bulkAdd(records)
      }
    }
  },

  async clear() {
    for (const table of db.tables) {
      await table.clear()
    }
  },
}
