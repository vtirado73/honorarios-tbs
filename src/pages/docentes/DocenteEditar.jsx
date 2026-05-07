import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { useDocente } from '../../modules/docentes/hooks/useDocente'
import DocenteForm from '../../modules/docentes/components/DocenteForm'

export default function DocenteEditar() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { docente, loading, error, update } = useDocente(id)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(data) {
    try {
      setSaving(true)
      await update(data)
      navigate(-1)
    } catch {
      alert('Ocurrió un error al actualizar el docente')
    } finally {
      setSaving(false)
    }
  }

  if (!id) {
    return (
      <div className="p-4 text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg">
        Docente no encontrado
      </div>
    )
  }

  if (loading) {
    return (
      <div className="text-center py-12 text-gray-400">Cargando...</div>
    )
  }

  if (error || !docente) {
    return (
      <div className="p-4 text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg">
        {error || 'Docente no encontrado'}
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Editar docente</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Modifique los datos del docente
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <DocenteForm
          initialData={docente}
          onSubmit={handleSubmit}
          onCancel={() => navigate(-1)}
          loading={saving}
        />
      </div>
    </div>
  )
}
