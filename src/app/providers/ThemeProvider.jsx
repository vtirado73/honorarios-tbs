import { useEffect, useCallback, useState } from 'react'
import { ThemeContext } from '../../shared/hooks/useTheme'

const MODE_KEY = 'theme_mode'

function getPreferredDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function loadMode() {
  return localStorage.getItem(MODE_KEY) || 'system'
}

function resolveDark(mode) {
  if (mode === 'dark') return true
  if (mode === 'light') return false
  return getPreferredDark()
}

export default function ThemeProvider({ children }) {
  const [mode, setModeState] = useState(loadMode)
  const [, forceRender] = useState(0)

  const dark = resolveDark(mode)

  const setMode = useCallback((newMode) => {
    localStorage.setItem(MODE_KEY, newMode)
    setModeState(newMode)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  useEffect(() => {
    if (mode !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => forceRender(n => n + 1)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [mode])

  return (
    <ThemeContext.Provider value={{ dark, mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  )
}
