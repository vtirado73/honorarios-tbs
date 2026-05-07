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

export default function WeeklyCalendar({ schedules, loading }) {
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
                  return (
                    <td
                      key={`${time}-${day}`}
                      className={`px-1 py-1 text-center border-b border-r border-gray-200 dark:border-gray-700 transition-colors ${
                        hasData
                          ? 'bg-indigo-100 dark:bg-indigo-900/40'
                          : 'bg-white dark:bg-gray-800'
                      }`}
                    >
                      {hasData && (
                        <div className="text-[10px] leading-tight text-indigo-700 dark:text-indigo-300">
                          {schedules.map(s => (
                            <div key={s.id} className="truncate max-w-[70px]" title={s.subject_name}>
                              {s.subject_name}
                            </div>
                          ))}
                        </div>
                      )}
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
