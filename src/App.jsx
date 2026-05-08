import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './app/providers/AuthProvider'
import DashboardLayout from './shared/layouts/DashboardLayout'
import Dashboard from './pages/dashboard/Dashboard'
import Docentes from './pages/docentes/Docentes'
import DocenteRegistro from './pages/docentes/DocenteRegistro'
import DocenteEditar from './pages/docentes/DocenteEditar'
import DocenteImportar from './pages/docentes/DocenteImportar'
import Carreras from './pages/carreras/Carreras'
import CarreraRegistro from './pages/carreras/CarreraRegistro'
import CarreraEditar from './pages/carreras/CarreraEditar'
import CarreraImportar from './pages/carreras/CarreraImportar'
import Asignaturas from './pages/asignaturas/Asignaturas'
import AsignaturaRegistro from './pages/asignaturas/AsignaturaRegistro'
import AsignaturaEditar from './pages/asignaturas/AsignaturaEditar'
import AsignaturaImportar from './pages/asignaturas/AsignaturaImportar'
import Periodos from './pages/periodos/Periodos'
import PeriodoRegistro from './pages/periodos/PeriodoRegistro'
import PeriodoEditar from './pages/periodos/PeriodoEditar'
import Schedules from './pages/schedules/Schedules'
import ScheduleRegistro from './pages/schedules/ScheduleRegistro'
import ScheduleEditar from './pages/schedules/ScheduleEditar'
import Settings from './pages/settings/Settings'
import Payroll from './pages/payroll/Payroll'
import Holidays from './pages/holidays/Holidays'
import Database from './pages/database/Database'
import HolidayRegistro from './pages/holidays/HolidayRegistro'
import HolidayEditar from './pages/holidays/HolidayEditar'
import Login from './pages/login/Login'
import Profile from './pages/profile/Profile'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  if (!user) {
    return <Navigate to="/login" replace />
  }
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="docentes">
              <Route index element={<Docentes />} />
              <Route path="registro" element={<DocenteRegistro />} />
              <Route path="editar/:id" element={<DocenteEditar />} />
              <Route path="importar" element={<DocenteImportar />} />
            </Route>
            <Route path="carreras">
              <Route index element={<Carreras />} />
              <Route path="registro" element={<CarreraRegistro />} />
              <Route path="editar/:id" element={<CarreraEditar />} />
              <Route path="importar" element={<CarreraImportar />} />
            </Route>
            <Route path="asignaturas">
              <Route index element={<Asignaturas />} />
              <Route path="registro" element={<AsignaturaRegistro />} />
              <Route path="editar/:id" element={<AsignaturaEditar />} />
              <Route path="importar" element={<AsignaturaImportar />} />
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
            <Route path="database" element={<Database />} />
            <Route path="profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
