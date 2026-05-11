import { pdf } from '@react-pdf/renderer'
import ReportePDF from '../components/ReportePDF'

function getFileName(periodName, careerName, nivel) {
  const safePeriod = periodName.replace(/\s+/g, '_')
  const safeCareer = careerName.replace(/\s+/g, '_')
  return `reporte_${safeCareer}_nivel_${nivel}_${safePeriod}.pdf`
}

export async function printReporte({ periodName, careerName, nivel, docentes, schedules }) {
  const blob = await pdf(
    <ReportePDF
      periodName={periodName}
      careerName={careerName}
      nivel={nivel}
      docentes={docentes}
      schedules={schedules}
    />
  ).toBlob()

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = getFileName(periodName, careerName, nivel)
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
