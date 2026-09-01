import type { IconName } from '../icons/Icon'

export type NavigationItem = {
  label: string
  path: string
  icon: IconName
}

export const navigationItems: NavigationItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
  { label: 'Logs', path: '/logs', icon: 'logs' },
  { label: 'Incidentes', path: '/incidentes', icon: 'incidents' },
  { label: 'Aplicaciones', path: '/aplicaciones', icon: 'apps' },
  { label: 'Usuarios', path: '/usuarios', icon: 'users' },
  { label: 'Alertas', path: '/alertas', icon: 'alert' },
  { label: 'Configuración', path: '/configuracion', icon: 'settings' },
]
