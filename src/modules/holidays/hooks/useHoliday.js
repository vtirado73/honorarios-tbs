import { useState, useEffect } from 'react'
import { holidayService } from '../services/holidayService'

export function useHoliday(id) {
  const [holiday, setHoliday] = useState(null)
  const [loading, setLoading] = useState(!!id)
  const [error, setError] = useState(null)

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { if (!id) setLoading(false) }, [id])

  useEffect(() => {
    if (!id) return
    let mounted = true
    holidayService.getById(id)
      .then(data => { if (mounted) setHoliday(data) })
      .catch(err => { if (mounted) setError(err.message) })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [id])

  return { holiday, loading, error }
}