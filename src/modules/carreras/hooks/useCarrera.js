import { useState, useEffect, useCallback } from 'react'
import { carreraService } from '../services/carreraService'

export function useCarrera(id) {
  const [carrera, setCarrera] = useState(null)
  const [loading, setLoading] = useState(!!id)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return

    let mounted = true

    carreraService.getById(id)
      .then(data => { if (mounted) setCarrera(data) })
      .catch(err => { if (mounted) setError(err.message) })
      .finally(() => { if (mounted) setLoading(false) })

    return () => { mounted = false }
  }, [id])

  const update = useCallback(async (data) => {
    if (!id) return
    return carreraService.update(id, data)
  }, [id])

  return { carrera, loading, error, update }
}
