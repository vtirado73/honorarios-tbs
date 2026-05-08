import db from '../../../database/db'

export const usersRepository = {
  async get() {
    return db.users.limit(1).first()
  },

  async upsert(user) {
    const existing = await this.get()
    await db.users.put({ id: existing?.id || crypto.randomUUID(), ...user })
    return this.get()
  },
}
