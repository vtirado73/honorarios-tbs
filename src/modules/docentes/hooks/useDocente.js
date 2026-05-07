import { useState, useEffect, useCallback } from 'react'
import { docenteService } from '../services/docenteService'

export function useDocente(id) {
  const [docente, setDocente] = useState(null)
  const [loading, setLoading] = useState(!!id)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return

    let mounted = true

    docenteService.getById(id)
      .then(data => { if (mounted) setDocente(data) })
      .catch(err => { if (mounted) setError(err.message) })
      .finally(() => { if (mounted) setLoading(false) })

    return () => { mounted = false }
  }, [id])

  const update = useCallback(async (data) => {
    if (!id) return
    return docenteService.update(id, data)
  }, [id])

  return { docente, loading, error, update }
}
