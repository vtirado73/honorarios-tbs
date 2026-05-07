import { useState, useEffect, useCallback } from 'react'
import { scheduleService } from '../services/scheduleService'

export function useSchedules() {
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)

    scheduleService.getAllEnriched()
      .then(data => setSchedules(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    let mounted = true

    scheduleService.getAllEnriched()
      .then(data => { if (mounted) setSchedules(data) })
      .catch(err => { if (mounted) setError(err.message) })
      .finally(() => { if (mounted) setLoading(false) })

    return () => { mounted = false }
  }, [])

  const toggleActive = useCallback(async (id) => {
    await scheduleService.toggleActive(id)
    await load()
  }, [load])

  return { schedules, loading, error, toggleActive, reload: load }
}
