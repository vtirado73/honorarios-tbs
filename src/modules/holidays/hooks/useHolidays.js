import { useState, useEffect } from 'react'
import { holidayService } from '../services/holidayService'

export function useHolidays() {
  const [holidays, setHolidays] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    holidayService.getAll()
      .then(data => { if (mounted) setHolidays(data) })
      .catch(err => { if (mounted) setError(err.message) })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  return { holidays, loading, error, refetch: () => holidayService.getAll().then(setHolidays) }
}