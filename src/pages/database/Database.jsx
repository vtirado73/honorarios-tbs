import { useState, useRef } from 'react'
import { databaseService } from '../../modules/database/services/databaseService'

export default function Database() {
  const [backupLoading, setBackupLoading] = useState(false)
  const [restoreLoading, setRestoreLoading] = useState(false)
  const [clearLoading, setClearLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const fileRef = useRef(null)

  function showMessage(text, type) {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 4000)
  }

  async function handleBackup() {
    try {
      setBackupLoading(true)
      const data = await databaseService.backup()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `backup_${new Date().toISOString().slice(0, 10)}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      showMessage('Copia de seguridad descargada correctamente', 'success')
    } catch {
      showMessage('Error al generar la copia de seguridad', 'error')
    } finally {
      setBackupLoading(false)
    }
  }

  async function handleRestore(e) {
    const file = e.target.files[0]
    if (!file) return

    if (!window.confirm('¿Está seguro de restaurar esta copia? Todos los datos actuales serán reemplazados.')) {
      fileRef.current.value = ''
      return
    }

    try {
      setRestoreLoading(true)
      const text = await file.text()
      const data = JSON.parse(text)
      await databaseService.restore(data)
      showMessage('Datos restaurados correctamente', 'success')
    } catch {
      showMessage('Error al restaurar. Verifique que el archivo sea una copia de seguridad válida.', 'error')
    } finally {
      setRestoreLoading(false)
      fileRef.current.value = ''
    }
  }

  async function handleClear() {
    if (!window.confirm('¿Está seguro de eliminar TODOS los datos? Esta acción no se puede deshacer.')) return
    if (!window.confirm('¿Está totalmente seguro? No hay forma de recuperar los datos.')) return

    try {
      setClearLoading(true)
      await databaseService.clear()
      showMessage('Todos los datos han sido eliminados', 'success')
    } catch {
      showMessage('Error al eliminar los datos', 'error')
    } finally {
      setClearLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Base de Datos
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Administración de copias de seguridad
        </p>
      </div>

      {message && (
        <div
          className={`mb-4 px-4 py-3 rounded-lg text-sm ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
              : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Descargar copia de seguridad
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Genera un archivo JSON con todos los datos de la base de datos.
          </p>
          <button
            onClick={handleBackup}
            disabled={backupLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            {backupLoading ? 'Generando...' : 'Descargar copia'}
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Restaurar copia de seguridad
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Seleccione un archivo JSON de respaldo para restaurar los datos. Los datos actuales serán reemplazados.
          </p>
          <div className="flex items-center gap-3">
            <label className="relative">
              <input
                ref={fileRef}
                type="file"
                accept=".json"
                onChange={handleRestore}
                disabled={restoreLoading}
                className="sr-only"
              />
              <span className="inline-block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                {restoreLoading ? 'Restaurando...' : 'Seleccionar archivo'}
              </span>
            </label>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-red-200 dark:border-red-900/50 p-6">
          <h2 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">
            Eliminar todos los datos
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Elimina permanentemente toda la información de la base de datos. Esta acción no se puede deshacer.
          </p>
          <button
            onClick={handleClear}
            disabled={clearLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {clearLoading ? 'Eliminando...' : 'Eliminar todos los datos'}
          </button>
        </div>
      </div>
    </div>
  )
}
