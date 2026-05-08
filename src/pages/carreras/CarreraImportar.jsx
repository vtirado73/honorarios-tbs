import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { parseExcel, importCarreras } from '../../modules/carreras/services/carreraImportService'

export default function CarreraImportar() {
  const navigate = useNavigate()
  const fileRef = useRef(null)
  const [rows, setRows] = useState(null)
  const [error, setError] = useState('')
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState(null)

  async function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    setError('')
    setRows(null)
    setResult(null)

    try {
      const data = await parseExcel(file)
      setRows(data)
    } catch (err) {
      setError(err.message)
      fileRef.current.value = ''
    }
  }

  function handleRemove(index) {
    setRows(prev => prev.filter((_, i) => i !== index))
  }

  async function handleUpload() {
    if (!rows || rows.length === 0) return
    setImporting(true)
    setError('')

    try {
      const res = await importCarreras(rows)
      setResult(res)
      if (res.errors.length === 0) {
        setTimeout(() => navigate('/carreras'), 1500)
      }
    } catch {
      setError('Error al subir los datos')
    } finally {
      setImporting(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Importar Carreras
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Suba un archivo Excel con los datos de las carreras
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Archivo Excel (.xlsx)
          </label>
          <input
            ref={fileRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFile}
            disabled={importing}
            className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-900/30 dark:file:text-indigo-300 dark:hover:file:bg-indigo-900/50"
          />
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            Columnas requeridas: acronym, name
          </p>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        {result && (
          <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${
            result.errors.length === 0
              ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
              : 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
          }`}>
            <p>{result.success} carrera{result.success !== 1 ? 's' : ''} importada{result.success !== 1 ? 's' : ''} correctamente.</p>
            {result.errors.length > 0 && (
              <ul className="mt-1 list-disc list-inside">
                {result.errors.map((e, i) => (
                  <li key={i}>Fila {e.row}: {e.error}</li>
                ))}
              </ul>
            )}
            {result.errors.length === 0 && (
              <p className="text-xs mt-1">Redirigiendo al listado...</p>
            )}
          </div>
        )}

        {rows && rows.length > 0 && (
          <>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-900/50 text-left text-gray-600 dark:text-gray-400">
                    <th className="px-3 py-2 font-medium w-16">N°</th>
                    <th className="px-3 py-2 font-medium">Sigla</th>
                    <th className="px-3 py-2 font-medium">Nombre</th>
                    <th className="px-3 py-2 font-medium text-right w-24">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {rows.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-3 py-2 text-gray-500 dark:text-gray-400">{i + 1}</td>
                      <td className="px-3 py-2 font-mono font-semibold text-indigo-600 dark:text-indigo-400">{row.acronym}</td>
                      <td className="px-3 py-2 text-gray-900 dark:text-white">{row.name}</td>
                      <td className="px-3 py-2 text-right">
                        <button
                          onClick={() => handleRemove(i)}
                          disabled={importing}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                          title="Eliminar"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {rows.length} registro{rows.length !== 1 ? 's' : ''} listo{rows.length !== 1 ? 's' : ''} para importar.
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={handleUpload}
                disabled={importing || rows.length === 0}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {importing ? 'Subiendo...' : 'Subir datos'}
              </button>
              <button
                onClick={() => navigate('/carreras')}
                disabled={importing}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
