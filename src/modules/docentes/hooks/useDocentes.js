import { useState, useEffect, useCallback } from 'react'
import { docenteService } from '../services/docenteService'

export function useDocentes() {
  const [docentes, setDocentes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true

    docenteService.getAll()
      .then(data => { if (mounted) setDocentes(data) })
      .catch(err => { if (mounted) setError(err.message) })
      .finally(() => { if (mounted) setLoading(false) })

    return () => { mounted = false }
  }, [])

  const toggleActive = useCallback(async (id) => {
    await docenteService.toggleActive(id)
    const data = await docenteService.getAll()
    setDocentes(data)
  }, [])

  return { docentes, loading, error, toggleActive }
}
