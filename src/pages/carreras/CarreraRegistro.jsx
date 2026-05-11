import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { carreraService } from '../../modules/carreras/services/carreraService'
import CarreraForm from '../../modules/carreras/components/CarreraForm'

export default function CarreraRegistro() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(data) {
    try {
      setLoading(true)
      setError('')
      await carreraService.create(data)
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Nueva carrera</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Registre una nueva carrera en el sistema
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        {error && (
          <div className="mb-4 p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg">
            {error}
          </div>
        )}
        <CarreraForm
          onSubmit={handleSubmit}
          onCancel={() => navigate(-1)}
          loading={loading}
        />
      </div>
    </div>
  )
}
