/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from 'react'
import { usersService } from '../../modules/users/services/usersService'

const AUTH_KEY = 'auth_user'

const AuthContext = createContext(null)

function loadUser() {
  try {
    const raw = sessionStorage.getItem(AUTH_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser)

  const login = useCallback(async (username, password) => {
    const u = await usersService.authenticate(username, password)
    if (u) {
      sessionStorage.setItem(AUTH_KEY, JSON.stringify(u))
      setUser(u)
      return u
    }
    return null
  }, [])

  const refreshUser = useCallback(async () => {
    const profile = await usersService.getProfile()
    sessionStorage.setItem(AUTH_KEY, JSON.stringify(profile))
    setUser(profile)
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem(AUTH_KEY)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
