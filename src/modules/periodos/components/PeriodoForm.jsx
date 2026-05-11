import { useState } from 'react'

export default function PeriodoForm({ initialData, onSubmit, onCancel, loading }) {
  const [name, setName] = useState(() => initialData?.name ?? '')
  const [startAt, setStartAt] = useState(() => initialData?.start_at ?? '')
  const [endAt, setEndAt] = useState(() => initialData?.end_at ?? '')
  const [errors, setErrors] = useState({})

  function validate() {
    const errs = {}
    if (!name.trim()) errs.name = 'El nombre del periodo es obligatorio'
    if (!startAt) errs.startAt = 'La fecha de inicio es obligatoria'
    if (!endAt) errs.endAt = 'La fecha de fin es obligatoria'
    if (startAt && endAt && startAt > endAt) {
      errs.endAt = 'La fecha de fin debe ser posterior a la fecha de inicio'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    onSubmit({
      name: name.trim(),
      start_at: startAt,
      end_at: endAt,
    })
  }

  function clearError(field) {
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Nombre del periodo <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={e => { setName(e.target.value); clearError('name') }}
          className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors ${
            errors.name
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500'
          }`}
          placeholder="Ej: Semestre 1-2026"
        />
        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Fecha de inicio <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={startAt}
            onChange={e => { setStartAt(e.target.value); clearError('startAt') }}
            className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors ${
              errors.startAt
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500'
            }`}
          />
          {errors.startAt && <p className="text-sm text-red-500 mt-1">{errors.startAt}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Fecha de fin <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={endAt}
            min={startAt || undefined}
            onChange={e => { setEndAt(e.target.value); clearError('endAt') }}
            className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors ${
              errors.endAt
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500'
            }`}
          />
          {errors.endAt && <p className="text-sm text-red-500 mt-1">{errors.endAt}</p>}
        </div>
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
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  )
}
