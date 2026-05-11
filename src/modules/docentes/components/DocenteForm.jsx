import { useState } from 'react'

const INITIAL = {
  name: '',
  lastname: '',
  surname: '',
  ci: '',
  email: '',
  phone: '',
  bank_name: '',
  bank_account: '',
}

const FIELDS = [
  { name: 'name', label: 'Nombre(s)', required: true },
  { name: 'lastname', label: 'Apellido paterno', required: true },
  { name: 'surname', label: 'Apellido materno' },
  { name: 'ci', label: 'Cédula de Identidad', required: true },
  { name: 'email', label: 'Correo electrónico', type: 'email', required: true },
  { name: 'phone', label: 'Teléfono', type: 'tel' },
  { name: 'bank_name', label: 'Banco' },
  { name: 'bank_account', label: 'Cuenta bancaria' },
]

export default function DocenteForm({ initialData, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(() => {
    if (!initialData) return { ...INITIAL }
    const obj = {}
    for (const key of Object.keys(INITIAL)) {
      obj[key] = initialData[key] ?? ''
    }
    return obj
  })
  const [errors, setErrors] = useState({})

  function validate() {
    const errs = {}
    if (!form.name.trim()) errs.name = 'El nombre es obligatorio'
    if (!form.lastname.trim()) errs.lastname = 'El apellido paterno es obligatorio'
    if (!form.ci.trim()) errs.ci = 'El CI es obligatorio'
    if (!form.email.trim()) {
      errs.email = 'El correo electrónico es obligatorio'
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errs.email = 'Correo electrónico inválido'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleChange(name) {
    return (e) => {
      setForm(prev => ({ ...prev, [name]: e.target.value }))
      if (errors[name]) {
        setErrors(prev => {
          const next = { ...prev }
          delete next[name]
          return next
        })
      }
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (validate()) onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FIELDS.map(f => (
          <div key={f.name}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {f.label}
              {f.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type={f.type || 'text'}
              value={form[f.name]}
              onChange={handleChange(f.name)}
              className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-colors ${
                errors[f.name]
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500'
              }`}
            />
            {errors[f.name] && (
              <p className="text-sm text-red-500 mt-1">{errors[f.name]}</p>
            )}
          </div>
        ))}
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
