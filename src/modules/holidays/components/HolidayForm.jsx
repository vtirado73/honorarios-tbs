import { useState } from 'react'

export default function HolidayForm({ initialData, onSubmit, onCancel, loading }) {
  const [title, setTitle] = useState(() => initialData?.title ?? '')
  const [description, setDescription] = useState(() => initialData?.description ?? '')
  const [date, setDate] = useState(() => initialData?.date ?? '')
  const [errors, setErrors] = useState({})

  const isCreating = !initialData

  function validate() {
    const errs = {}
    if (!title.trim()) errs.title = 'El título es requerido'
    if (!date) errs.date = 'La fecha es requerida'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    onSubmit({ title: title.trim(), description: description.trim(), date })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Título <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={e => { setTitle(e.target.value); if (errors.title) setErrors(prev => { const n = { ...prev }; delete n.title; return n }) }}
          className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors ${
            errors.title ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500'
          }`}
          placeholder="Ej: Año Nuevo"
        />
        {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Descripción
        </label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
          placeholder="Opcional"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Fecha <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          value={date}
          onChange={e => { setDate(e.target.value); if (errors.date) setErrors(prev => { const n = { ...prev }; delete n.date; return n }) }}
          className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors ${
            errors.date ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500'
          }`}
        />
        {errors.date && <p className="text-sm text-red-500 mt-1">{errors.date}</p>}
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
          {loading ? 'Guardando...' : isCreating ? 'Guardar' : 'Actualizar'}
        </button>
      </div>
    </form>
  )
}