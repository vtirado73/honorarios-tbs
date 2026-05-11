import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSettings } from '../../modules/settings/hooks/useSettings'

const MONEY_REGEX = /^\d+(\.\d{2})?$/

function MoneyInput({ value, onChange, error, disabled }) {
  const [touched, setTouched] = useState(false)
  const ref = useRef(null)

  function handleInput(e) {
    const raw = e.target.value
    const filtered = raw.replace(/[^\d.]/g, '')
    const dotCount = (filtered.match(/\./g) || []).length
    let result = filtered

    if (dotCount > 1) {
      const firstDot = filtered.indexOf('.')
      result = filtered.slice(0, firstDot + 1) + filtered.slice(firstDot + 1).replace(/\./g, '')
    }

    const parts = result.split('.')
    if (parts.length === 2 && parts[1].length > 2) {
      result = parts[0] + '.' + parts[1].slice(0, 2)
    }

    onChange(result)
  }

  function handleBlur() {
    setTouched(true)
  }

  const showError = touched && value !== '' && !MONEY_REGEX.test(value)

  return (
    <div>
      <input
        ref={ref}
        type="text"
        inputMode="decimal"
        value={value}
        onInput={handleInput}
        onBlur={handleBlur}
        disabled={disabled}
        placeholder="0"
        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
          showError || error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 dark:focus:ring-indigo-400'
        }`}
      />
      {showError && (
        <p className="mt-1 text-xs text-red-500 dark:text-red-400">
          Ingrese un número entero o con 2 decimales (ej: 150 o 150.00)
        </p>
      )}
      {error && (
        <p className="mt-1 text-xs text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  )
}

function TimeRangeInput({ startValue, endValue, onStartChange, onEndChange, disabled }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
          Desde
        </label>
        <input
          type="time"
          value={startValue}
          onChange={e => onStartChange(e.target.value)}
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
          Hasta
        </label>
        <input
          type="time"
          value={endValue}
          onChange={e => onEndChange(e.target.value)}
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
    </div>
  )
}

const SHIFTS = [
  { key: 'morning', label: 'Turno Mañana', startField: 'morning_start', endField: 'morning_end' },
  { key: 'afternoon', label: 'Turno Tarde', startField: 'afternoon_start', endField: 'afternoon_end' },
  { key: 'evening', label: 'Turno Noche', startField: 'evening_start', endField: 'evening_end' },
]

function SettingsForm({ settings, save, saving, hookError, navigate }) {
  const [payPerHour, setPayPerHour] = useState(settings.pay_per_hour)

  const [morningStart, setMorningStart] = useState(settings.morning_start || '07:00')
  const [morningEnd, setMorningEnd] = useState(settings.morning_end || '14:00')
  const [afternoonStart, setAfternoonStart] = useState(settings.afternoon_start || '14:00')
  const [afternoonEnd, setAfternoonEnd] = useState(settings.afternoon_end || '19:00')
  const [eveningStart, setEveningStart] = useState(settings.evening_start || '19:00')
  const [eveningEnd, setEveningEnd] = useState(settings.evening_end || '22:00')

  const [localError, setLocalError] = useState(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLocalError(null)
    setSuccess(false)

    if (!MONEY_REGEX.test(payPerHour)) {
      setLocalError('El monto debe ser un número entero o con 2 decimales (ej: 150 o 150.00)')
      return
    }

    try {
      await save({
        pay_per_hour: payPerHour,
        morning_start: morningStart,
        morning_end: morningEnd,
        afternoon_start: afternoonStart,
        afternoon_end: afternoonEnd,
        evening_start: eveningStart,
        evening_end: eveningEnd,
      })
      setSuccess(true)
    } catch {
      // error is set by hook
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
            Pago por hora
          </h2>
          <div className="max-w-xs">
            <label
              htmlFor="payPerHour"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Monto (Bs)
            </label>
            <MoneyInput
              value={payPerHour}
              onChange={setPayPerHour}
              error={localError || hookError}
              disabled={saving}
            />
          </div>
        </div>

        <hr className="border-gray-200 dark:border-gray-700" />

        <div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
            Horarios de turnos
          </h2>
          <div className="space-y-4">
            {SHIFTS.map(shift => (
              <div
                key={shift.key}
                className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4"
              >
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-3">
                  {shift.label}
                </p>
                <TimeRangeInput
                  startValue={
                    shift.key === 'morning' ? morningStart :
                    shift.key === 'afternoon' ? afternoonStart :
                    eveningStart
                  }
                  endValue={
                    shift.key === 'morning' ? morningEnd :
                    shift.key === 'afternoon' ? afternoonEnd :
                    eveningEnd
                  }
                  onStartChange={
                    shift.key === 'morning' ? setMorningStart :
                    shift.key === 'afternoon' ? setAfternoonStart :
                    setEveningStart
                  }
                  onEndChange={
                    shift.key === 'morning' ? setMorningEnd :
                    shift.key === 'afternoon' ? setAfternoonEnd :
                    setEveningEnd
                  }
                  disabled={saving}
                />
              </div>
            ))}
          </div>
        </div>

        <hr className="border-gray-200 dark:border-gray-700" />

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? 'Guardando...' : 'Guardar'}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Cancelar
          </button>
        </div>

        {success && (
          <p className="text-sm text-green-600 dark:text-green-400 font-medium">
            Configuración guardada exitosamente
          </p>
        )}
      </form>
    </div>
  )
}

export default function Settings() {
  const navigate = useNavigate()
  const { settings, loading, saving, error: hookError, save } = useSettings()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Configuración</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Configuración del sistema de pagos</p>
      </div>

      <div className="max-w-lg">
        <SettingsForm
          key={settings.id}
          settings={settings}
          save={save}
          saving={saving}
          hookError={hookError}
          navigate={navigate}
        />
      </div>
    </div>
  )
}
