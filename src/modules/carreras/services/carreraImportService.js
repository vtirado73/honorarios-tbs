import * as XLSX from 'xlsx'
import { carreraRepository } from '../repositories/carreraRepository'

const EXPECTED_HEADERS = ['acronym', 'name']

export function parseExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames.find(n => n === 'CARRERAS')
        if (!sheetName) {
          reject(new Error('Formato incompatible. No se encontró la hoja "CARRERAS".'))
          return
        }
        const sheet = workbook.Sheets[sheetName]
        const json = XLSX.utils.sheet_to_json(sheet, { defval: '' })

        if (json.length === 0) {
          reject(new Error('El archivo no contiene datos'))
          return
        }

        const headers = Object.keys(json[0]).map(h => h.trim().toLowerCase())
        const missing = EXPECTED_HEADERS.filter(h => !headers.includes(h))

        if (missing.length > 0) {
          reject(new Error(`Formato incompatible. Columnas faltantes: ${missing.join(', ')}`))
          return
        }

        const rows = json.map((row, i) => {
          const entry = {}
          for (const key of EXPECTED_HEADERS) {
            const actualKey = Object.keys(row).find(k => k.trim().toLowerCase() === key)
            entry[key] = actualKey ? String(row[actualKey]).trim() : ''
          }
          return { ...entry, _index: i }
        })

        resolve(rows)
      } catch {
        reject(new Error('Formato incompatible. No se pudo leer el archivo.'))
      }
    }
    reader.onerror = () => reject(new Error('Error al leer el archivo'))
    reader.readAsArrayBuffer(file)
  })
}

export async function importCarreras(rows) {
  const results = { success: 0, errors: [] }

  for (const row of rows) {
    try {
      const data = {
        acronym: row.acronym,
        name: row.name,
      }
      await carreraRepository.create(data)
      results.success++
    } catch (err) {
      results.errors.push({ row: row._index + 2, error: err.message || 'Error al insertar' })
    }
  }

  return results
}
