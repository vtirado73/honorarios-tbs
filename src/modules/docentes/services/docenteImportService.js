import * as XLSX from 'xlsx'
import { docenteRepository } from '../repositories/docenteRepository'

const EXPECTED_HEADERS = ['name', 'lastname', 'surname', 'ci', 'email', 'phone', 'bank_name', 'bank_account']

export function parseExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames.find(n => n === 'DOCENTES')
        if (!sheetName) {
          reject(new Error('Formato incompatible. No se encontró la hoja "DOCENTES".'))
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

export async function importDocentes(rows) {
  const results = { success: 0, errors: [] }

  for (const row of rows) {
    try {
      const data = {
        name: row.name,
        lastname: row.lastname,
        surname: row.surname || '',
        ci: row.ci,
        email: row.email || '',
        phone: row.phone || '',
        bank_name: row.bank_name || '',
        bank_account: row.bank_account || '',
      }
      await docenteRepository.create(data)
      results.success++
    } catch (err) {
      results.errors.push({ row: row._index + 2, error: err.message || 'Error al insertar' })
    }
  }

  return results
}
