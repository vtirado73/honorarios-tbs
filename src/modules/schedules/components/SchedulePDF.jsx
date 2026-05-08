import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer'

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
  const covered = new Set()

  for (let i = 0; i < TIME_SLOTS.length - 1; i++) {
    const slotStart = timeToMinutes(TIME_SLOTS[i])
    const slotEnd = timeToMinutes(TIME_SLOTS[i + 1])
    if (slotStart < endMin && slotEnd > startMin) {
      covered.add(i)
    }
  }

  return covered
}

const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontSize: 7,
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 9,
    color: '#555',
    textAlign: 'center',
    marginBottom: 2,
  },
  hr: {
    borderBottom: '1.5 solid #333',
    marginVertical: 6,
  },
  info: {
    fontSize: 8,
    marginBottom: 8,
    flexDirection: 'row',
    gap: 16,
  },
  table: {
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#e5e7eb',
    borderBottom: '1 solid #aaa',
  },
  headerCell: {
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 3,
    paddingHorizontal: 1,
    borderRight: '1 solid #ccc',
    fontSize: 7,
  },
  headerCellLast: {
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 3,
    paddingHorizontal: 1,
    fontSize: 7,
  },
  timeCol: {
    width: '6%',
  },
  dayCol: {
    width: '12.57%',
  },
  row: {
    flexDirection: 'row',
    borderBottom: '1 solid #ddd',
  },
  cell: {
    paddingVertical: 2,
    paddingHorizontal: 1,
    textAlign: 'center',
    borderRight: '1 solid #eee',
    fontSize: 6.5,
  },
  cellLast: {
    paddingVertical: 2,
    paddingHorizontal: 1,
    textAlign: 'center',
    fontSize: 6.5,
  },
  timeLabel: {
    fontSize: 6.5,
    color: '#555',
  },
  timeLabelHour: {
    fontWeight: 'bold',
    color: '#333',
  },
  filled: {
    backgroundColor: '#eef2ff',
  },
  noData: {
    color: '#d1d5db',
    fontSize: 5,
  },
  total: {
    marginTop: 8,
    textAlign: 'right',
    fontSize: 10,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 7,
    color: '#999',
  },
})

function dayLabel(day) {
  return day.charAt(0).toUpperCase() + day.slice(1)
}

function buildGrid(schedules) {
  const active = schedules.filter(s => s.active)
  const slotMap = {} // `rowIdx-dayIdx` -> [subject_acronym, ...]

  for (const s of active) {
    const dayIdx = DAYS.indexOf(s.day)
    if (dayIdx === -1) continue
    const covered = getCoveredSlots(s.start_at, s.end_at)
    for (const rowIdx of covered) {
      const key = `${rowIdx}-${dayIdx}`
      if (!slotMap[key]) slotMap[key] = []
      const label = s.subject_acronym || s.subject_name || '—'
      if (!slotMap[key].includes(label)) {
        slotMap[key].push(label)
      }
    }
  }

  return slotMap
}

export default function SchedulePDF({ teacher, period, schedules }) {
  const slotMap = buildGrid(schedules)
  const teacherName = `${teacher.name} ${teacher.lastname}${teacher.surname ? ' ' + teacher.surname : ''}`
  const totalHours = schedules
    .filter(s => s.active)
    .reduce((sum, s) => {
      const [sh, sm] = s.start_at.split(':').map(Number)
      const [eh, em] = s.end_at.split(':').map(Number)
      return sum + ((eh * 60 + em) - (sh * 60 + sm)) / 60
    }, 0)

  const now = new Date()
  const dateStr = now.toLocaleDateString('es-BO')
  const timeStr = now.toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' })

  return (
    <Document>
      <Page size="A4" style={styles.page} orientation="landscape">
        <Text style={styles.title}>Horarios</Text>
        <Text style={styles.subtitle}>Reporte de Horarios Docentes</Text>
        <View style={styles.hr} />
        <View style={styles.info}>
          <Text>Docente: {teacherName}</Text>
          <Text>CI: {teacher.ci || '—'}</Text>
          <Text>Periodo: {period.name}</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.headerRow} fixed>
            <Text style={[styles.headerCell, styles.timeCol]}>Desde</Text>
            <Text style={[styles.headerCell, styles.timeCol]}>Hasta</Text>
            {DAYS.map((day, i) => (
              <Text
                key={day}
                style={i === DAYS.length - 1 ? styles.headerCellLast : [styles.headerCell, styles.dayCol]}
              >
                {dayLabel(day)}
              </Text>
            ))}
          </View>

          {TIME_SLOTS.slice(0, -1).map((time, rowIdx) => {
            const nextTime = TIME_SLOTS[rowIdx + 1]
            const isHour = time.endsWith(':00')

            return (
              <View key={time} style={[styles.row, !isHour && { backgroundColor: '#f9fafb' }]} wrap={false}>
                <Text style={[styles.cell, styles.timeCol, isHour ? styles.timeLabelHour : styles.timeLabel]}>
                  {time}
                </Text>
                <Text style={[styles.cell, styles.timeCol, isHour ? styles.timeLabelHour : styles.timeLabel]}>
                  {nextTime}
                </Text>
                {DAYS.map((day, dayIdx) => {
                  const key = `${rowIdx}-${dayIdx}`
                  const subjects = slotMap[key]
                  const isLast = dayIdx === DAYS.length - 1

                  return (
                    <View
                      key={day}
                      style={[
                        isLast ? styles.cellLast : styles.cell,
                        styles.dayCol,
                        subjects && subjects.length > 0 && styles.filled,
                      ]}
                    >
                      {subjects && subjects.length > 0 ? (
                        subjects.map((sub, si) => (
                          <Text key={si} style={{ fontSize: 6, fontWeight: 'bold', color: '#4338ca' }}>
                            {sub}
                          </Text>
                        ))
                      ) : (
                        <Text style={styles.noData}>—</Text>
                      )}
                    </View>
                  )
                })}
              </View>
            )
          })}
        </View>

        <Text style={styles.total}>
          Total horas semanales: {totalHours.toFixed(1)} hrs
        </Text>

        <Text style={styles.footer}>
          Generado el {dateStr} a las {timeStr}
        </Text>
      </Page>
    </Document>
  )
}
