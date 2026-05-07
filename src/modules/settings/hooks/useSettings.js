import { useState, useEffect, useCallback } from 'react'
import { settingsService } from '../services/settingsService'

export function useSettings() {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true

    settingsService.get()
      .then(data => { if (mounted) setSettings(data) })
      .catch(err => { if (mounted) setError(err.message) })
      .finally(() => { if (mounted) setLoading(false) })

    return () => { mounted = false }
  }, [])

  const save = useCallback(async (data) => {
    setSaving(true)
    setError(null)

    try {
      const updated = await settingsService.update(settings.id, data)
      setSettings(updated)
      return updated
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setSaving(false)
    }
  }, [settings])

  return { settings, loading, saving, error, save }
}
