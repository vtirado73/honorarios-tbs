import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from './shared/layouts/DashboardLayout'
import Dashboard from './pages/dashboard/Dashboard'
import Docentes from './pages/docentes/Docentes'
import DocenteRegistro from './pages/docentes/DocenteRegistro'
import DocenteEditar from './pages/docentes/DocenteEditar'
import Carreras from './pages/carreras/Carreras'
import CarreraRegistro from './pages/carreras/CarreraRegistro'
import CarreraEditar from './pages/carreras/CarreraEditar'
import Asignaturas from './pages/asignaturas/Asignaturas'
import AsignaturaRegistro from './pages/asignaturas/AsignaturaRegistro'
import AsignaturaEditar from './pages/asignaturas/AsignaturaEditar'
import Periodos from './pages/periodos/Periodos'
import PeriodoRegistro from './pages/periodos/PeriodoRegistro'
import PeriodoEditar from './pages/periodos/PeriodoEditar'
import Schedules from './pages/schedules/Schedules'
import ScheduleRegistro from './pages/schedules/ScheduleRegistro'
import ScheduleEditar from './pages/schedules/ScheduleEditar'
import Settings from './pages/settings/Settings'
import Payroll from './pages/payroll/Payroll'
import Holidays from './pages/holidays/Holidays'
import HolidayRegistro from './pages/holidays/HolidayRegistro'
import HolidayEditar from './pages/holidays/HolidayEditar'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="docentes">
            <Route index element={<Docentes />} />
            <Route path="registro" element={<DocenteRegistro />} />
            <Route path="editar/:id" element={<DocenteEditar />} />
          </Route>
          <Route path="carreras">
            <Route index element={<Carreras />} />
            <Route path="registro" element={<CarreraRegistro />} />
            <Route path="editar/:id" element={<CarreraEditar />} />
          </Route>
          <Route path="asignaturas">
            <Route index element={<Asignaturas />} />
            <Route path="registro" element={<AsignaturaRegistro />} />
            <Route path="editar/:id" element={<AsignaturaEditar />} />
          </Route>
          <Route path="periodos">
            <Route index element={<Periodos />} />
            <Route path="registro" element={<PeriodoRegistro />} />
            <Route path="editar/:id" element={<PeriodoEditar />} />
          </Route>
          <Route path="schedules">
            <Route index element={<Schedules />} />
            <Route path="registro" element={<ScheduleRegistro />} />
            <Route path="editar/:id" element={<ScheduleEditar />} />
          </Route>
          <Route path="settings" element={<Settings />} />
          <Route path="payroll" element={<Payroll />} />
          <Route path="holidays">
            <Route index element={<Holidays />} />
            <Route path="registro" element={<HolidayRegistro />} />
            <Route path="editar/:id" element={<HolidayEditar />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
