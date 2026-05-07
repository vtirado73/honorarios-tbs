import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { docenteService } from '../../modules/docentes/services/docenteService'
import DocenteForm from '../../modules/docentes/components/DocenteForm'

export default function DocenteRegistro() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(data) {
    try {
      setLoading(true)
      await docenteService.create(data)
      navigate(-1)
    } catch {
      alert('Ocurrió un error al guardar el docente')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Nuevo docente</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Registre un nuevo docente en el sistema
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <DocenteForm
          onSubmit={handleSubmit}
          onCancel={() => navigate(-1)}
          loading={loading}
        />
      </div>
    </div>
  )
}
