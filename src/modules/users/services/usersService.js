import { usersRepository } from '../repositories/usersRepository'
import { hashPassword } from './password'

const DEFAULT_USER = 'admin'
const DEFAULT_PASS = '123456'

export const usersService = {
  async authenticate(user, password) {
    const record = await usersRepository.get()
    if (!record) {
      return user === DEFAULT_USER && password === DEFAULT_PASS
        ? { id: null, fullname: 'Administrador', username: DEFAULT_USER }
        : null
    }
    const hashed = await hashPassword(password)
    if (user === record.user && hashed === record.password) {
      return { id: record.id, fullname: record.fullname, username: record.user }
    }
    return null
  },

  async getProfile() {
    const record = await usersRepository.get()
    if (!record) {
      return { id: null, fullname: 'Administrador', username: DEFAULT_USER }
    }
    return { id: record.id, fullname: record.fullname, username: record.user }
  },

  async updateProfile({ fullname, username, currentPassword, newPassword }) {
    const record = await usersRepository.get()
    const hashedCurrent = await hashPassword(currentPassword)

    if (record) {
      if (hashedCurrent !== record.password) {
        throw new Error('La contraseña actual no es correcta')
      }
    } else {
      if (currentPassword !== DEFAULT_PASS) {
        throw new Error('La contraseña actual no es correcta')
      }
    }

    const update = { fullname, user: username }
    if (newPassword) {
      update.password = await hashPassword(newPassword)
    }

    return usersRepository.upsert(update)
  },
}
