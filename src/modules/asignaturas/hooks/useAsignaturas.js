import { useState, useEffect, useCallback } from 'react'
import { asignaturaService } from '../services/asignaturaService'

export function useAsignaturas() {
  const [asignaturas, setAsignaturas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true

    asignaturaService.getAll()
      .then(data => { if (mounted) setAsignaturas(data) })
      .catch(err => { if (mounted) setError(err.message) })
      .finally(() => { if (mounted) setLoading(false) })

    return () => { mounted = false }
  }, [])

  const toggleActive = useCallback(async (id) => {
    await asignaturaService.toggleActive(id)
    const data = await asignaturaService.getAll()
    setAsignaturas(data)
  }, [])

  return { asignaturas, loading, error, toggleActive }
}
