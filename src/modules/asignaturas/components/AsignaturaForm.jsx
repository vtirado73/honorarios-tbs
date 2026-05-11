import { useState } from 'react'

export default function AsignaturaForm({ initialData, carreras, defaultCareerId, onSubmit, onCancel, loading }) {
  const [name, setName] = useState(() => initialData?.name ?? '')
  const [acronym, setAcronym] = useState(() => initialData?.acronym ?? '')
  const [careerId, setCareerId] = useState(() => initialData?.career_id ?? defaultCareerId ?? '')
  const [errors, setErrors] = useState({})

  const carreraBloqueada = !!defaultCareerId && !initialData
  const activeCarreras = carreras.filter(c => c.active)

  function validate() {
    const errs = {}
    if (!name.trim()) errs.name = 'El nombre es obligatorio'
    if (!acronym.trim()) errs.acronym = 'La sigla es obligatoria'
    if (!careerId) errs.careerId = 'Debe seleccionar una carrera'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    onSubmit({
      name: name.trim(),
      acronym: acronym.trim().toUpperCase(),
      career_id: careerId,
    })
  }

  function clearError(field) {
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Sigla <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={acronym}
          onChange={e => { setAcronym(e.target.value); clearError('acronym') }}
          className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors uppercase ${
            errors.acronym
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500'
          }`}
          placeholder="Ej: SIS-101"
        />
        {errors.acronym && <p className="text-sm text-red-500 mt-1">{errors.acronym}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Nombre de la asignatura <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={e => { setName(e.target.value); clearError('name') }}
          className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors ${
            errors.name
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500'
          }`}
          placeholder="Ej: Introducción a la Programación"
        />
        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Carrera <span className="text-red-500">*</span>
        </label>
        <select
          value={careerId}
          disabled={carreraBloqueada}
          onChange={e => { setCareerId(e.target.value); clearError('careerId') }}
          className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors ${
            carreraBloqueada ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : ''
          } ${
            errors.careerId
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500'
          }`}
        >
          <option value="">Seleccione una carrera</option>
          {activeCarreras.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        {errors.careerId && <p className="text-sm text-red-500 mt-1">{errors.careerId}</p>}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  )
}
