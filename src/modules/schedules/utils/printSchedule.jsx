import { pdf } from '@react-pdf/renderer'
import SchedulePDF from '../components/SchedulePDF'

function getPDFFileName(teacher, period) {
  const safeName = `${teacher.name}_${teacher.lastname}`.replace(/\s+/g, '_')
  const safePeriod = period.name.replace(/\s+/g, '_')
  return `horarios_${safeName}_${safePeriod}.pdf`
}

export async function printSchedule({ teacher, period, schedules }) {
  const blob = await pdf(
    <SchedulePDF teacher={teacher} period={period} schedules={schedules} />
  ).toBlob()

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = getPDFFileName(teacher, period)
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
