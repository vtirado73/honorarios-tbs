import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 8,
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 9,
    color: '#555',
    textAlign: 'center',
    marginBottom: 4,
  },
  header: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 4,
    padding: '4 0',
    borderBottom: '1 solid #ccc',
  },
  headerInfo: {
    fontSize: 8,
    color: '#666',
    marginBottom: 8,
  },
  table: {
    width: '100%',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderBottom: '1 solid #ccc',
    paddingVertical: 3,
  },
  tableHeaderCell: {
    fontWeight: 'bold',
    paddingHorizontal: 3,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #eee',
    paddingVertical: 2,
  },
  tableCell: {
    paddingHorizontal: 3,
  },
  tableFooter: {
    flexDirection: 'row',
    backgroundColor: '#e8edf5',
    fontWeight: 'bold',
    paddingVertical: 3,
    borderTop: '1 solid #999',
  },
  right: { textAlign: 'right' },
  center: { textAlign: 'center' },
  colFecha: { width: '11%' },
  colDia: { width: '10%' },
  colMateria: { width: '22%' },
  colEntrada: { width: '9%' },
  colSalida: { width: '9%' },
  colMin: { width: '10%' },
  colHora: { width: '10%' },
  colMinRate: { width: '10%' },
  colPago: { width: '9%' },
  grandTotal: {
    marginTop: 12,
    padding: 8,
    backgroundColor: '#4338ca',
    color: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 12,
    fontWeight: 'bold',
  },
})

function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-')
  return `${d}/${m}/${y}`
}

function fmt(n) {
  return n.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function TeacherTable({ teacher, fmt }) {
  return (
    <View>
      <View style={styles.header}>
        <Text>{teacher.name} — CI: {teacher.ci}</Text>
      </View>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, styles.colFecha]}>Fecha</Text>
            <Text style={[styles.tableHeaderCell, styles.colDia]}>Día</Text>
            <Text style={[styles.tableHeaderCell, styles.colMateria]}>Asignatura</Text>
            <Text style={[styles.tableHeaderCell, styles.colEntrada]}>Entrada</Text>
            <Text style={[styles.tableHeaderCell, styles.colSalida]}>Salida</Text>
            <Text style={[styles.tableHeaderCell, styles.colMin]}>Min</Text>
            <Text style={[styles.tableHeaderCell, styles.colHora]}>$/h</Text>
            <Text style={[styles.tableHeaderCell, styles.colMinRate]}>$/min</Text>
            <Text style={[styles.tableHeaderCell, styles.colPago]}>Pagado</Text>
          </View>
          {teacher.entries.map((entry, ei) =>
            entry.schedules.map((sch, si) => (
              <View key={`${ei}-${si}`} style={styles.tableRow}>
                {si === 0 && (
                  <>
                    <View style={[styles.tableCell, styles.colFecha]}><Text>{formatDate(entry.date)}</Text></View>
                    <View style={[styles.tableCell, styles.colDia]}><Text>{entry.dayName}</Text></View>
                  </>
                )}
                {si > 0 && (
                  <>
                    <View style={[styles.tableCell, styles.colFecha]} />
                    <View style={[styles.tableCell, styles.colDia]} />
                  </>
                )}
                <View style={[styles.tableCell, styles.colMateria]}>
                  <Text>{sch.subjectAcronym || sch.subjectName}</Text>
                </View>
                <View style={[styles.tableCell, styles.colEntrada, styles.center]}>
                  <Text>{sch.startAt}</Text>
                </View>
                <View style={[styles.tableCell, styles.colSalida, styles.center]}>
                  <Text>{sch.endAt}</Text>
                </View>
                <View style={[styles.tableCell, styles.colMin, styles.right]}>
                  <Text>{sch.minutes}</Text>
                </View>
                <View style={[styles.tableCell, styles.colHora, styles.right]}>
                  <Text>{fmt(sch.payPerHour)}</Text>
                </View>
                <View style={[styles.tableCell, styles.colMinRate, styles.right]}>
                  <Text>{fmt(sch.payPerMinute)}</Text>
                </View>
                <View style={[styles.tableCell, styles.colPago, styles.right]}>
                  <Text>{fmt(sch.pay)}</Text>
                </View>
              </View>
            ))
          )}
        </View>
        <View style={styles.tableFooter}>
          <View style={[styles.tableCell, { width: '73%' }]}>
            <Text>Total {teacher.name}</Text>
          </View>
          <View style={[styles.tableCell, styles.colMin, styles.right]}>
            <Text>{teacher.totalMinutes}</Text>
          </View>
          <View style={[styles.tableCell, { width: '10%' }]} />
          <View style={[styles.tableCell, { width: '10%' }]} />
          <View style={[styles.tableCell, styles.colPago, styles.right]}>
            <Text>{fmt(teacher.totalPay)}</Text>
          </View>
        </View>
    </View>
  )
}

function ReportHeader({ report, fmt }) {
  return (
    <>
      <Text style={styles.title}>Reporte de Honorarios</Text>
      <Text style={styles.subtitle}>Periodo: {report.periodName}</Text>
      <Text style={styles.headerInfo}>
        Pago por hora: Bs {fmt(report.payPerHour)} | Pago por minuto: Bs {fmt(report.payPerMinute)}
      </Text>
    </>
  )
}

export default function HonorarioPDF({ report }) {
  return (
    <Document>
      {report.teachers.map(teacher => (
        <Page key={teacher.id} size="A4" style={styles.page} orientation="landscape">
          <ReportHeader report={report} fmt={fmt} />
          <TeacherTable teacher={teacher} fmt={fmt} />
        </Page>
      ))}
      {report.teachers.length > 1 && (
        <Page size="A4" style={styles.page} orientation="landscape">
          <ReportHeader report={report} fmt={fmt} />
          <View style={styles.grandTotal}>
            <Text>Total general pagado</Text>
            <Text>Bs {fmt(report.grandTotal)}</Text>
          </View>
        </Page>
      )}
    </Document>
  )
}