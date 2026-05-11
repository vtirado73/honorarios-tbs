import { useState } from 'react'

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

const DAY_MAP = {
  lunes: 0, martes: 1, miércoles: 2, jueves: 3, viernes: 4, sábado: 5, domingo: 6,
}

export default function WeeklyCalendar({
  schedules,
  loading,
  interactive,
  selectedCells,
  replaceTargets,
  deleteTargets,
  onToggleCell,
  onToggleReplace,
  onToggleDelete,
  subjectAcronym,
}) {
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

  const [hoveredRow, setHoveredRow] = useState(null)
  const [hoveredCol, setHoveredCol] = useState(null)

  function isHoveredCell(rowIdx, colIdx) {
    return (hoveredRow === rowIdx) || (hoveredCol === colIdx)
  }

  function getScheduleInfo(row, col) {
    return scheduleMap[`${row}-${col}`] || []
  }

  function handleCellClick(e, rowIdx, day, start_at, end_at) {
    if (!interactive) return

    const colIdx = DAY_MAP[day]
    const schedulesInCell = scheduleMap[`${rowIdx}-${colIdx}`] || []
    const hasExisting = schedulesInCell.length > 0

    if (hasExisting) {
      if (e.ctrlKey || e.metaKey) {
        const ids = schedulesInCell.map(s => s.id)
        for (const id of ids) {
          if (onToggleDelete) onToggleDelete(id)
        }
      } else {
        const ids = schedulesInCell.map(s => s.id)
        for (const id of ids) {
          if (onToggleReplace) onToggleReplace(id)
        }
      }
    } else if (onToggleCell) {
      onToggleCell(day, start_at, end_at)
    }
  }

  function isSelected(day, start_at, end_at) {
    if (!selectedCells) return false
    for (const key of selectedCells) {
      const parts = key.split('|')
      if (parts[0] === day && parts[1] === start_at && parts[2] === end_at) return true
    }
    return false
  }

  function cellStyle(hasData, sel, replaced, deleted) {
    if (sel) return 'bg-emerald-100 dark:bg-emerald-900/40 cursor-pointer'
    if (deleted) return 'bg-red-100 dark:bg-red-900/40 cursor-pointer line-through'
    if (replaced) return 'bg-amber-100 dark:bg-amber-900/40 cursor-pointer'
    if (hasData) return 'bg-indigo-100 dark:bg-indigo-900/40 cursor-pointer hover:bg-indigo-200 dark:hover:bg-indigo-800/40'
    if (interactive) return 'bg-white dark:bg-gray-800 cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
    return 'bg-white dark:bg-gray-800'
  }

  return (
    <div className="overflow-auto max-h-[600px] border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
      onMouseLeave={() => { setHoveredRow(null); setHoveredCol(null) }}
    >
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-900">
            <th className="px-1 py-2 text-center text-gray-500 dark:text-gray-400 font-medium border-b border-r border-gray-200 dark:border-gray-700 min-w-[32px] w-[32px]">
              Desde
            </th>
            <th className="px-1 py-2 text-center text-gray-500 dark:text-gray-400 font-medium border-b border-r border-gray-200 dark:border-gray-700 min-w-[32px] w-[32px]">
              Hasta
            </th>
            {DAYS.map((day, colIdx) => (
              <th
                key={day}
                onMouseEnter={() => setHoveredCol(colIdx)}
                className={`px-1 py-2 text-center font-medium border-b border-r border-gray-200 dark:border-gray-700 min-w-[70px] capitalize transition-colors ${
                  hoveredCol === colIdx
                    ? 'text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/20'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
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
            const rowHovered = hoveredRow === rowIdx
            return (
              <tr key={time} className={`${!isHour ? 'bg-gray-50/50 dark:bg-gray-700/20' : ''}`}>
                <td
                  onMouseEnter={() => setHoveredRow(rowIdx)}
                  className={`px-1 py-1 text-center border-b border-r border-gray-200 dark:border-gray-700 transition-colors ${
                    isHour ? 'font-semibold' : ''
                  } ${
                    rowHovered
                      ? 'text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/20'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {time}
                </td>
                <td
                  onMouseEnter={() => setHoveredRow(rowIdx)}
                  className={`px-1 py-1 text-center border-b border-r border-gray-200 dark:border-gray-700 transition-colors ${
                    isHour ? 'font-semibold' : ''
                  } ${
                    rowHovered
                      ? 'text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/20'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {nextTime}
                </td>
                {DAYS.map((day, colIdx) => {
                  const data = getScheduleInfo(rowIdx, colIdx)
                  const hasData = data.length > 0
                  const sel = isSelected(day, time, nextTime)
                  const replaced = hasData && data.some(s => replaceTargets?.has(s.id))
                  const deleted = hasData && data.some(s => deleteTargets?.has(s.id))

                  const hovered = isHoveredCell(rowIdx, colIdx)
                  return (
                    <td
                      key={`${time}-${day}`}
                      onMouseEnter={() => { setHoveredRow(rowIdx); setHoveredCol(colIdx) }}
                      onClick={(e) => handleCellClick(e, rowIdx, day, time, nextTime)}
                      className={`px-1 py-1 text-center border-b border-r border-gray-200 dark:border-gray-700 transition-colors select-none ${cellStyle(hasData, sel, replaced, deleted)} ${hovered ? 'bg-indigo-50/70 dark:bg-indigo-900/15' : ''}`}
                      title={
                        sel && subjectAcronym
                          ? subjectAcronym
                          : hasData
                            ? data.map(s => {
                                if (replaceTargets?.has(s.id)) return `${s.subject_acronym || s.subject_name}/${subjectAcronym}`
                                if (deleteTargets?.has(s.id)) return `${s.subject_acronym || s.subject_name} (eliminar)`
                                return `${s.professor_name} - ${s.subject_name}`
                              }).join('\n')
                            : ''
                      }
                    >
                      <div className="text-[10px] leading-tight">
                        {sel ? (
                          <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                            {subjectAcronym || '✓'}
                          </span>
                        ) : hasData ? (
                          data.map(s => {
                            const isReplaced = replaceTargets?.has(s.id)
                            const isDeleted = deleteTargets?.has(s.id)
                            return (
                              <div
                                key={s.id}
                                className={`truncate max-w-[70px] text-gray-700 dark:text-gray-200 ${isDeleted ? 'line-through text-red-600 dark:text-red-400' : ''} ${isReplaced ? 'text-amber-700 dark:text-amber-300' : ''}`}
                                title={s.subject_name}
                              >
                                {isReplaced ? (
                                  <><span className="line-through text-red-600 dark:text-red-400">{s.subject_acronym || s.subject_name}</span><span className="text-emerald-600 dark:text-emerald-400">/{subjectAcronym}</span></>
                                ) : (s.subject_acronym || s.subject_name)}
                              </div>
                            )
                          })
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

      {interactive && (replaceTargets?.size > 0 || deleteTargets?.size > 0) && (
        <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700 text-xs flex gap-4">
          {replaceTargets?.size > 0 && (
            <span className="text-amber-600 dark:text-amber-400">
              {replaceTargets.size} horario{replaceTargets.size > 1 ? 's' : ''} marcado{replaceTargets.size > 1 ? 's' : ''} para reemplazar
            </span>
          )}
          {deleteTargets?.size > 0 && (
            <span className="text-red-600 dark:text-red-400">
              {deleteTargets.size} horario{deleteTargets.size > 1 ? 's' : ''} marcado{deleteTargets.size > 1 ? 's' : ''} para eliminar
            </span>
          )}
        </div>
      )}
    </div>
  )
}