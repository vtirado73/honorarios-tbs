import { useState, useEffect, useCallback } from 'react'
import { asignaturaService } from '../services/asignaturaService'

export function useAsignatura(id) {
  const [asignatura, setAsignatura] = useState(null)
  const [loading, setLoading] = useState(!!id)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return

    let mounted = true

    asignaturaService.getById(id)
      .then(data => { if (mounted) setAsignatura(data) })
      .catch(err => { if (mounted) setError(err.message) })
      .finally(() => { if (mounted) setLoading(false) })

    return () => { mounted = false }
  }, [id])

  const update = useCallback(async (data) => {
    if (!id) return
    return asignaturaService.update(id, data)
  }, [id])

  return { asignatura, loading, error, update }
}
