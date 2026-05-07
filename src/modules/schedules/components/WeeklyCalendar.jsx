import { useEffect, useState } from 'react'
import { settingsService } from '../../settings/services/settingsService'

const DAYS = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo']

function generateTimeSlots() {
  const slots = []
  for (let h = 7; h < 22; h++) {
    const hour = String(h).padStart(2, '0')
    slots.push(`${hour}:00`)
    slots.push(`${hour}:30`)
  }
  slots.push('22:00')
  return slots
}

const TIME_SLOTS = generateTimeSlots()

function timeToMinutes(t) {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

function getCoveredSlots(start, end) {
  const startMin = timeToMinutes(start)
  const endMin = timeToMinutes(end)
  const covered = []

  for (let i = 0; i < TIME_SLOTS.length - 1; i++) {
    const slotStart = timeToMinutes(TIME_SLOTS[i])
    const slotEnd = timeToMinutes(TIME_SLOTS[i + 1])
    if (slotStart < endMin && slotEnd > startMin) {
      covered.push(i)
    }
  }

  return covered
}

function slotShift(start_at, sett) {
  const m = timeToMinutes(start_at)
  const mStart = timeToMinutes(sett?.morning_start || '07:00')
  const mEnd = timeToMinutes(sett?.morning_end || '12:00')
  const aStart = timeToMinutes(sett?.afternoon_start || '13:00')
  const aEnd = timeToMinutes(sett?.afternoon_end || '18:00')
  if (m >= mStart && m < mEnd) return 'mañana'
  if (m >= aStart && m < aEnd) return 'tarde'
  return 'noche'
}

const DAY_MAP = {
  lunes: 0, martes: 1, miércoles: 2, jueves: 3, viernes: 4, sábado: 5, domingo: 6,
}

export default function WeeklyCalendar({
  schedules,
  loading,
  interactive,
  selectedCells,
  onToggleCell,
  subjectAcronym,
}) {
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    if (!interactive) return
    let mounted = true
    settingsService.get().then(s => { if (mounted) setSettings(s) }).catch(() => {})
    return () => { mounted = false }
  }, [interactive])

  const scheduleMap = {}

  if (schedules) {
    for (const s of schedules) {
      if (!s.active) continue
      const col = DAY_MAP[s.day]
      if (col === undefined) continue
      const rows = getCoveredSlots(s.start_at, s.end_at)
      for (const row of rows) {
        const key = `${row}-${col}`
        scheduleMap[key] = scheduleMap[key] || []
        const existing = scheduleMap[key]
        const isDuplicate = existing.some(e => e.id === s.id)
        if (!isDuplicate) {
          scheduleMap[key].push(s)
        }
      }
    }
  }

  function getScheduleInfo(row, col) {
    return scheduleMap[`${row}-${col}`] || []
  }

  function handleCellClick(rowIdx, day, start_at, end_at) {
    if (!interactive || !onToggleCell) return
    const occup = getScheduleInfo(rowIdx, DAY_MAP[day])
    if (occup.length > 0) return
    const shift = slotShift(start_at, settings)
    onToggleCell(day, start_at, end_at, shift)
  }

  function isSelected(day, start_at, end_at) {
    if (!selectedCells) return false
    for (const key of selectedCells) {
      const parts = key.split('|')
      if (parts[0] === day && parts[1] === start_at && parts[2] === end_at) return true
    }
    return false
  }

  return (
    <div className="overflow-auto max-h-[600px] border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-900">
            <th className="px-1 py-2 text-center text-gray-500 dark:text-gray-400 font-medium border-b border-r border-gray-200 dark:border-gray-700 min-w-[32px] w-[32px]">
              Desde
            </th>
            <th className="px-1 py-2 text-center text-gray-500 dark:text-gray-400 font-medium border-b border-r border-gray-200 dark:border-gray-700 min-w-[32px] w-[32px]">
              Hasta
            </th>
            {DAYS.map(day => (
              <th
                key={day}
                className="px-1 py-2 text-center text-gray-600 dark:text-gray-300 font-medium border-b border-r border-gray-200 dark:border-gray-700 min-w-[70px] capitalize"
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TIME_SLOTS.slice(0, -1).map((time, rowIdx) => {
            const nextTime = TIME_SLOTS[rowIdx + 1]
            const isHour = time.endsWith(':00')
            return (
              <tr key={time} className={`${!isHour ? 'bg-gray-50/50 dark:bg-gray-700/20' : ''}`}>
                <td className={`px-1 py-1 text-center text-gray-500 dark:text-gray-400 border-b border-r border-gray-200 dark:border-gray-700 ${isHour ? 'font-semibold text-gray-700 dark:text-gray-200' : ''}`}>
                  {time}
                </td>
                <td className={`px-1 py-1 text-center text-gray-500 dark:text-gray-400 border-b border-r border-gray-200 dark:border-gray-700 ${isHour ? 'font-semibold text-gray-700 dark:text-gray-200' : ''}`}>
                  {nextTime}
                </td>
                {DAYS.map((day, colIdx) => {
                  const schedules = getScheduleInfo(rowIdx, colIdx)
                  const hasData = schedules.length > 0
                  const sel = isSelected(day, time, nextTime)
                  const clickable = interactive && !hasData && !!onToggleCell

                  return (
                    <td
                      key={`${time}-${day}`}
                      onClick={() => handleCellClick(rowIdx, day, time, nextTime)}
                      className={`px-1 py-1 text-center border-b border-r border-gray-200 dark:border-gray-700 transition-colors select-none ${
                        hasData
                          ? 'bg-indigo-100 dark:bg-indigo-900/40'
                          : sel
                            ? 'bg-emerald-100 dark:bg-emerald-900/40'
                            : clickable
                              ? 'bg-white dark:bg-gray-800 cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
                              : 'bg-white dark:bg-gray-800'
                      }`}
                      title={
                        hasData
                          ? schedules.map(s => `${s.professor_name} - ${s.subject_name}`).join('\n')
                          : sel && subjectAcronym
                            ? subjectAcronym
                            : ''
                      }
                    >
                      <div className="text-[10px] leading-tight">
                        {hasData ? (
                          schedules.map(s => (
                            <div key={s.id} className="truncate max-w-[70px]" title={s.subject_name}>
                              {s.subject_acronym || s.subject_name}
                            </div>
                          ))
                        ) : sel ? (
                          <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                            {subjectAcronym || '✓'}
                          </span>
                        ) : null}
                      </div>
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-gray-800/60">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600" />
        </div>
      )}
    </div>
  )
}