import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from './shared/layouts/DashboardLayout'
import Dashboard from './pages/dashboard/Dashboard'
import Docentes from './pages/docentes/Docentes'
import Careers from './pages/careers/Careers'
import Subjects from './pages/subjects/Subjects'
import Periods from './pages/periods/Periods'
import Schedules from './pages/schedules/Schedules'
import Settings from './pages/settings/Settings'
import Payroll from './pages/payroll/Payroll'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="docentes" element={<Docentes />} />
          <Route path="careers" element={<Careers />} />
          <Route path="subjects" element={<Subjects />} />
          <Route path="periods" element={<Periods />} />
          <Route path="schedules" element={<Schedules />} />
          <Route path="settings" element={<Settings />} />
          <Route path="payroll" element={<Payroll />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
