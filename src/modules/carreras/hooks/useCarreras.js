import { useState, useEffect, useCallback } from 'react'
import { carreraService } from '../services/carreraService'

export function useCarreras() {
  const [carreras, setCarreras] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true

    carreraService.getAll()
      .then(data => { if (mounted) setCarreras(data) })
      .catch(err => { if (mounted) setError(err.message) })
      .finally(() => { if (mounted) setLoading(false) })

    return () => { mounted = false }
  }, [])

  const toggleActive = useCallback(async (id) => {
    await carreraService.toggleActive(id)
    const data = await carreraService.getAll()
    setCarreras(data)
  }, [])

  return { carreras, loading, error, toggleActive }
}
