import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { useCarrera } from '../../modules/carreras/hooks/useCarrera'
import CarreraForm from '../../modules/carreras/components/CarreraForm'

export default function CarreraEditar() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { carrera, loading, error: loadError, update } = useCarrera(id)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(data) {
    try {
      setSaving(true)
      setError('')
      await update(data)
      navigate(-1)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (!id) {
    return (
      <div className="p-4 text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg">
        Carrera no encontrada
      </div>
    )
  }

  if (loading) {
    return (
      <div className="text-center py-12 text-gray-400">Cargando...</div>
    )
  }

  if (loadError || !carrera) {
    return (
      <div className="p-4 text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg">
        {loadError || 'Carrera no encontrada'}
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Editar carrera</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Modifique los datos de la carrera
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        {error && (
          <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg">
            {error}
          </div>
        )}
        <CarreraForm
          initialData={carrera}
          onSubmit={handleSubmit}
          onCancel={() => navigate(-1)}
          loading={saving}
        />
      </div>
    </div>
  )
}
