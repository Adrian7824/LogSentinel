import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { AlertsPage } from './pages/AlertsPage'
import { DashboardPage } from './pages/DashboardPage'
import { IncidentsPage } from './pages/IncidentsPage'
import { LogsPage } from './pages/LogsPage'
import { PlaceholderPage } from './pages/PlaceholderPage'
import { SettingsPage } from './pages/SettingsPage'
import { UsersPage } from './pages/UsersPage'

const pages = [
  {
    path: 'aplicaciones',
    title: 'Aplicaciones',
    description: 'Administra los servicios y aplicaciones monitoreados.',
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
        <Route path="usuarios" element={<UsersPage />} />
        <Route path="configuracion" element={<SettingsPage />} />
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
