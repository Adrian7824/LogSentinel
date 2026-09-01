import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { AlertsPage } from './pages/AlertsPage'
import { DashboardPage } from './pages/DashboardPage'
import { IncidentsPage } from './pages/IncidentsPage'
import { LogsPage } from './pages/LogsPage'
import { PlaceholderPage } from './pages/PlaceholderPage'

const pages = [
  {
    path: 'aplicaciones',
    title: 'Aplicaciones',
    description: 'Administra los servicios y aplicaciones monitoreados.',
  },
  {
    path: 'usuarios',
    title: 'Usuarios',
    description: 'Analiza la actividad de usuarios registrada en los eventos.',
  },
  {
    path: 'configuracion',
    title: 'Configuración',
    description: 'Ajusta las preferencias generales de LogSentinel.',
  },
] as const

export function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate replace to="/dashboard" />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="logs" element={<LogsPage />} />
        <Route path="incidentes" element={<IncidentsPage />} />
        <Route path="alertas" element={<AlertsPage />} />
        {pages.map((page) => (
          <Route
            key={page.path}
            path={page.path}
            element={
              <PlaceholderPage
                title={page.title}
                description={page.description}
              />
            }
          />
        ))}
        <Route path="*" element={<Navigate replace to="/dashboard" />} />
      </Route>
    </Routes>
  )
}
