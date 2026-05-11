import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { holidayService } from '../../modules/holidays/services/holidayService'
import { useHoliday } from '../../modules/holidays/hooks/useHoliday'
import HolidayForm from '../../modules/holidays/components/HolidayForm'

export default function HolidayEditar() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { holiday, loading: fetching } = useHoliday(id)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(data) {
    try {
      setSaving(true)
      await holidayService.update(id, data)
      navigate('/holidays')
    } catch (err) {
      if (typeof err === 'object' && !(err instanceof Error)) return
      alert('Error al actualizar el feriado')
    } finally {
      setSaving(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    )
  }

  if (!holiday) {
    return (
      <div className="p-4 text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg">
        Feriado no encontrado
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Editar Feriado</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Modificar datos del día feriado</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <HolidayForm
          initialData={holiday}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/holidays')}
          loading={saving}
        />
      </div>
    </div>
  )
}