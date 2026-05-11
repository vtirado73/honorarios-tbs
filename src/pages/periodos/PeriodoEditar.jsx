import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { usePeriodo } from '../../modules/periodos/hooks/usePeriodo'
import PeriodoForm from '../../modules/periodos/components/PeriodoForm'

export default function PeriodoEditar() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { periodo, loading, error: loadError, update } = usePeriodo(id)
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
      <div className="p-4 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg">
        Periodo no encontrado
      </div>
    )
  }

  if (loading) {
    return <div className="text-center py-12 text-gray-400">Cargando...</div>
  }

  if (loadError || !periodo) {
    return (
      <div className="p-4 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg">
        {loadError || 'Periodo no encontrado'}
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Editar periodo</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Modifique los datos del periodo académico
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        {error && (
          <div className="mb-4 p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg">
            {error}
          </div>
        )}
        <PeriodoForm
          initialData={periodo}
          onSubmit={handleSubmit}
          onCancel={() => navigate(-1)}
          loading={saving}
        />
      </div>
    </div>
  )
}
