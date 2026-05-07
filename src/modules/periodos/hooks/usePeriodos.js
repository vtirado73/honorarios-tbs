import { useState, useEffect, useCallback } from 'react'
import { periodoService } from '../services/periodoService'

export function usePeriodos() {
  const [periodos, setPeriodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true

    periodoService.getAll()
      .then(data => { if (mounted) setPeriodos(data) })
      .catch(err => { if (mounted) setError(err.message) })
      .finally(() => { if (mounted) setLoading(false) })

    return () => { mounted = false }
  }, [])

  const toggleActive = useCallback(async (id) => {
    await periodoService.toggleActive(id)
    const data = await periodoService.getAll()
    setPeriodos(data)
  }, [])

  return { periodos, loading, error, toggleActive }
}
