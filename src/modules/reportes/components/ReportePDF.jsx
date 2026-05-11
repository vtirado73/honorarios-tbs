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
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 2,
  },
  asignaturaItem: {
    marginBottom: 4,
    fontSize: 10,
    color: '#333',
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
  detailTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
    color: '#333',
  },
  detailTable: {
    width: '100%',
  },
  detailHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#e5e7eb',
    borderBottom: '1 solid #aaa',
  },
  detailHeaderCell: {
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 2,
    paddingHorizontal: 2,
    borderRight: '1 solid #ccc',
    fontSize: 7,
  },
  detailRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #ddd',
  },
  detailCell: {
    paddingVertical: 2,
    paddingHorizontal: 2,
    fontSize: 7,
    borderRight: '1 solid #eee',
  },
  colSigla: { width: '12%' },
  colAsignatura: { width: '34%' },
  colDocente: { width: '36%' },
  colTelefono: { width: '18%' },
})

function dayLabel(day) {
  return day.charAt(0).toUpperCase() + day.slice(1)
}

function buildGrid(schedules) {
  const active = schedules.filter(s => s.active)
  const slotMap = {}

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

export default function ReportePDF({ periodName, careerName, nivel, docentes, schedules }) {
  const slotMap = buildGrid(schedules)
  const totalHours = schedules
    .filter(s => s.active)
    .reduce((sum, s) => {
      const [sh, sm] = s.start_at.split(':').map(Number)
      const [eh, em] = s.end_at.split(':').map(Number)
      return sum + ((eh * 60 + em) - (sh * 60 + sm)) / 60
    }, 0)

  const docenteNameMap = Object.fromEntries(
    docentes.map(d => [d.id, `${d.name} ${d.lastname}${d.surname ? ' ' + d.surname : ''}`])
  )

  const docentePhoneMap = Object.fromEntries(
    docentes.map(d => [d.id, d.phone || '—'])
  )

  const detailRows = []
  const seen = new Set()
  for (const s of schedules) {
    if (!s.active) continue
    const key = `${s.subject_id}|${s.professor_id}`
    if (seen.has(key)) continue
    seen.add(key)
    detailRows.push({
      acronym: s.subject_acronym || '—',
      subject: s.subject_name || '—',
      docente: docenteNameMap[s.professor_id] || s.professor_name || '—',
      phone: docentePhoneMap[s.professor_id],
    })
  }
  detailRows.sort((a, b) => a.subject.localeCompare(b.subject))

  const now = new Date()
  const dateStr = now.toLocaleDateString('es-BO')
  const timeStr = now.toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' })

  return (
    <Document>
      <Page size="A4" style={styles.page} orientation="portrait">
        <Text style={styles.title}>Reporte de Horarios</Text>
        <Text style={styles.subtitle}>Por periodo, carrera y nivel</Text>
        <View style={styles.hr} />
        <View style={styles.info}>
          <View style={styles.infoRow}>
            <Text>Periodo: {periodName}</Text>
            <Text>Carrera: {careerName}</Text>
            <Text>Nivel: {nivel}</Text>
          </View>
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

        {detailRows.length > 0 && (
          <>
            <Text style={styles.detailTitle}>
              Detalle de asignaturas y docentes ({detailRows.length})
            </Text>
            <View style={styles.detailTable}>
              <View style={styles.detailHeaderRow}>
                <Text style={[styles.detailHeaderCell, styles.colSigla]}>Sigla</Text>
                <Text style={[styles.detailHeaderCell, styles.colAsignatura]}>Asignatura</Text>
                <Text style={[styles.detailHeaderCell, styles.colDocente]}>Docente</Text>
                <Text style={[styles.detailHeaderCell, styles.colTelefono, { borderRight: 0 }]}>Teléfono</Text>
              </View>
              {detailRows.map((r, i) => (
                <View key={i} style={[styles.detailRow, i % 2 === 1 && { backgroundColor: '#f9fafb' }]} wrap={false}>
                  <Text style={[styles.detailCell, styles.colSigla, { textAlign: 'center' }]}>{r.acronym}</Text>
                  <Text style={[styles.detailCell, styles.colAsignatura]}>{r.subject}</Text>
                  <Text style={[styles.detailCell, styles.colDocente]}>{r.docente}</Text>
                  <Text style={[styles.detailCell, styles.colTelefono, { borderRight: 0, textAlign: 'center' }]}>{r.phone}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        <Text style={styles.footer}>
          Generado el {dateStr} a las {timeStr}
        </Text>
      </Page>
    </Document>
  )
}
