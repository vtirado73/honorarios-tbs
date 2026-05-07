import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAsignatura } from '../../modules/asignaturas/hooks/useAsignatura'
import AsignaturaForm from '../../modules/asignaturas/components/AsignaturaForm'
import { carreraService } from '../../modules/carreras/services/carreraService'

export default function AsignaturaEditar() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { asignatura, loading: loadingAsignatura, error: errorAsignatura, update } = useAsignatura(id)
  const [carreras, setCarreras] = useState([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    carreraService.getAll()
      .then(setCarreras)
      .catch(() => setError('Error al cargar carreras'))
  }, [])

  async function handleSubmit(data) {
    try {
      setSaving(true)
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
        Asignatura no encontrada
      </div>
    )
  }

  if (loadingAsignatura) {
    return <div className="text-center py-12 text-gray-400">Cargando...</div>
  }

  if (errorAsignatura || !asignatura) {
    return (
      <div className="p-4 text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg">
        {errorAsignatura || 'Asignatura no encontrada'}
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Editar asignatura</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Modifique los datos de la asignatura
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        {error && (
          <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg">
            {error}
          </div>
        )}
        <AsignaturaForm
          initialData={asignatura}
          carreras={carreras}
          onSubmit={handleSubmit}
          onCancel={() => navigate(-1)}
          loading={saving}
        />
      </div>
    </div>
  )
}
