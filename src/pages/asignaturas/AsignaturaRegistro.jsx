import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { asignaturaService } from '../../modules/asignaturas/services/asignaturaService'
import AsignaturaForm from '../../modules/asignaturas/components/AsignaturaForm'
import { carreraService } from '../../modules/carreras/services/carreraService'

export default function AsignaturaRegistro() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const carreraIdParam = searchParams.get('carrera_id')
  const [carreras, setCarreras] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    carreraService.getAll()
      .then(setCarreras)
      .catch(() => setError('Error al cargar carreras'))
  }, [])

  async function handleSubmit(data) {
    try {
      setLoading(true)
      await asignaturaService.create(data)
      navigate(-1)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Nueva asignatura</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Registre una nueva asignatura en el sistema
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        {error && (
          <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg">
            {error}
          </div>
        )}
        <AsignaturaForm
          carreras={carreras}
          defaultCareerId={carreraIdParam}
          onSubmit={handleSubmit}
          onCancel={() => navigate(-1)}
          loading={loading}
        />
      </div>
    </div>
  )
}
