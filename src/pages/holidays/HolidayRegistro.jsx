import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { holidayService } from '../../modules/holidays/services/holidayService'
import HolidayForm from '../../modules/holidays/components/HolidayForm'

export default function HolidayRegistro() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(data) {
    try {
      setLoading(true)
      await holidayService.create(data)
      navigate('/holidays')
    } catch (err) {
      if (typeof err === 'object' && !(err instanceof Error)) return
      alert('Error al guardar el feriado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Nuevo Feriado</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Registrar un nuevo día feriado</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <HolidayForm
          onSubmit={handleSubmit}
          onCancel={() => navigate('/holidays')}
          loading={loading}
        />
      </div>
    </div>
  )
}