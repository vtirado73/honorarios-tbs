import { useState, useEffect, useCallback } from 'react'
import { periodoService } from '../services/periodoService'

export function usePeriodo(id) {
  const [periodo, setPeriodo] = useState(null)
  const [loading, setLoading] = useState(!!id)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return

    let mounted = true

    periodoService.getById(id)
      .then(data => { if (mounted) setPeriodo(data) })
      .catch(err => { if (mounted) setError(err.message) })
      .finally(() => { if (mounted) setLoading(false) })

    return () => { mounted = false }
  }, [id])

  const update = useCallback(async (data) => {
    if (!id) return
    return periodoService.update(id, data)
  }, [id])

  return { periodo, loading, error, update }
}
