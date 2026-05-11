import { useState, useEffect, useCallback } from 'react'
import { reporteService } from '../services/reporteService'

export function useReporte() {
  const [periodos, setPeriodos] = useState([])
  const [carreras, setCarreras] = useState([])
  const [asignaturas, setAsignaturas] = useState([])
  const [docentes, setDocentes] = useState([])
  const [schedules, setSchedules] = useState([])
  const [periodId, setPeriodId] = useState('')
  const [careerId, setCareerId] = useState('')
  const [nivel, setNivel] = useState('')
  const [loading, setLoading] = useState(false)
  const niveles = reporteService.getNiveles()

  useEffect(() => {
    let mounted = true
    Promise.all([
      reporteService.getPeriodos(),
      reporteService.getCarreras(),
    ]).then(([p, c]) => {
      if (mounted) {
        setPeriodos(p)
        setCarreras(c)
      }
    })
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    let mounted = true

    Promise.resolve().then(() => {
      if (!mounted) return
      if (!periodId || !careerId || !nivel) {
        setAsignaturas([])
        setSchedules([])
        setLoading(false)
        return
      }

      setLoading(true)
      reporteService.getSchedulesPorNivel(periodId, careerId, nivel)
        .then(({ schedules, asignaturas, docentes }) => {
          if (mounted) {
            setSchedules(schedules)
            setAsignaturas(asignaturas)
            setDocentes(docentes)
          }
        })
        .catch(() => {
          if (mounted) {
            setSchedules([])
            setAsignaturas([])
            setDocentes([])
          }
        })
        .finally(() => { if (mounted) setLoading(false) })
    })

    return () => { mounted = false }
  }, [periodId, careerId, nivel])

  const handlePeriodChange = useCallback((value) => {
    setPeriodId(value)
  }, [])

  const handleCareerChange = useCallback((value) => {
    setCareerId(value)
    setNivel('')
  }, [])

  const handleNivelChange = useCallback((value) => {
    setNivel(value)
  }, [])

  return {
    periodos, carreras, asignaturas, docentes, schedules,
    periodId, careerId, nivel,
    loading, niveles,
    handlePeriodChange, handleCareerChange,
    handleNivelChange,
  }
}
