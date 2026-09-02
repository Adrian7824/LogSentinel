import type {
  PermissionAction,
  UserAccount,
  UserModule,
  UserPermissions,
  UserRole,
  Weekday,
} from '../types/user'

function minutesAgo(minutes: number) {
  return new Date(Date.now() - minutes * 60_000).toISOString()
}

export const userModules: Array<{ id: UserModule; label: string }> = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'logs', label: 'Logs' },
  { id: 'incidents', label: 'Incidentes' },
  { id: 'alerts', label: 'Alertas' },
  { id: 'applications', label: 'Aplicaciones' },
  { id: 'users', label: 'Usuarios' },
  { id: 'settings', label: 'Configuración' },
]

export const permissionActions: Array<{ id: PermissionAction; label: string }> = [
  { id: 'VIEW', label: 'Ver' },
  { id: 'CREATE', label: 'Crear' },
  { id: 'EDIT', label: 'Editar' },
  { id: 'MANAGE', label: 'Administrar' },
]

export const weekdays: Array<{ id: Weekday; shortLabel: string; label: string }> = [
  { id: 'MON', shortLabel: 'L', label: 'Lunes' },
  { id: 'TUE', shortLabel: 'M', label: 'Martes' },
  { id: 'WED', shortLabel: 'X', label: 'Miércoles' },
  { id: 'THU', shortLabel: 'J', label: 'Jueves' },
  { id: 'FRI', shortLabel: 'V', label: 'Viernes' },
  { id: 'SAT', shortLabel: 'S', label: 'Sábado' },
  { id: 'SUN', shortLabel: 'D', label: 'Domingo' },
]

export const roleDefinitions: Array<{
  id: UserRole
  label: string
  description: string
}> = [
  {
    id: 'ADMIN',
    label: 'Administrador',
    description: 'Acceso completo a la configuración y administración de la plataforma.',
  },
  {
    id: 'OPERATOR',
    label: 'Operador / Analista',
    description: 'Consulta y gestiona logs, incidentes, alertas y aplicaciones.',
  },
  {
    id: 'VIEWER',
    label: 'Visualizador',
    description: 'Acceso de lectura a los módulos operativos principales.',
  },
]

const allActions: PermissionAction[] = ['VIEW', 'CREATE', 'EDIT', 'MANAGE']

const rolePermissions: Record<UserRole, UserPermissions> = {
  ADMIN: {
    dashboard: allActions,
    logs: allActions,
    incidents: allActions,
    alerts: allActions,
    applications: allActions,
    users: allActions,
    settings: allActions,
  },
  OPERATOR: {
    dashboard: ['VIEW'],
    logs: ['VIEW', 'CREATE', 'EDIT'],
    incidents: ['VIEW', 'CREATE', 'EDIT', 'MANAGE'],
    alerts: ['VIEW', 'CREATE', 'EDIT'],
    applications: ['VIEW', 'EDIT'],
    users: [],
    settings: [],
  },
  VIEWER: {
    dashboard: ['VIEW'],
    logs: ['VIEW'],
    incidents: ['VIEW'],
    alerts: ['VIEW'],
    applications: ['VIEW'],
    users: [],
    settings: [],
  },
}

export function createPermissionsForRole(role: UserRole): UserPermissions {
  return Object.fromEntries(
    userModules.map(({ id }) => [id, [...rolePermissions[role][id]]]),
  ) as UserPermissions
}

const weekdaysOnly: Weekday[] = ['MON', 'TUE', 'WED', 'THU', 'FRI']

export const mockUsers: UserAccount[] = [
  {
    id: 'USR-001',
    name: 'Mariana Rojas',
    email: 'mariana.rojas@logsentinel.demo',
    role: 'ADMIN',
    status: 'ACTIVE',
    lastAccess: minutesAgo(8),
    accessPolicy: { type: 'ALWAYS', allowedDays: [], startTime: '00:00', endTime: '23:59' },
    permissions: createPermissionsForRole('ADMIN'),
    recentActivity: [
      { id: 'ACT-001', timestamp: minutesAgo(8), description: 'Consultó el incidente INC-0042.' },
      { id: 'ACT-002', timestamp: minutesAgo(35), description: 'Actualizó una regla de alerta.' },
      { id: 'ACT-003', timestamp: minutesAgo(120), description: 'Inició sesión en la maqueta.' },
    ],
  },
  {
    id: 'USR-002',
    name: 'Carlos Vega',
    email: 'carlos.vega@logsentinel.demo',
    role: 'OPERATOR',
    status: 'ACTIVE',
    lastAccess: minutesAgo(42),
    accessPolicy: {
      type: 'RESTRICTED',
      allowedDays: weekdaysOnly,
      startTime: '08:00',
      endTime: '18:00',
    },
    permissions: createPermissionsForRole('OPERATOR'),
    recentActivity: [
      { id: 'ACT-004', timestamp: minutesAgo(42), description: 'Filtró logs de API Gateway.' },
      { id: 'ACT-005', timestamp: minutesAgo(75), description: 'Revisó un error con código 503.' },
    ],
  },
  {
    id: 'USR-003',
    name: 'Ana Santos',
    email: 'ana.santos@logsentinel.demo',
    role: 'OPERATOR',
    status: 'ACTIVE',
    lastAccess: minutesAgo(93),
    accessPolicy: {
      type: 'RESTRICTED',
      allowedDays: weekdaysOnly,
      startTime: '07:00',
      endTime: '17:00',
    },
    permissions: createPermissionsForRole('OPERATOR'),
    recentActivity: [
      { id: 'ACT-006', timestamp: minutesAgo(93), description: 'Revisó eventos de Billing Worker.' },
      { id: 'ACT-007', timestamp: minutesAgo(180), description: 'Cerró un incidente resuelto.' },
    ],
  },
  {
    id: 'USR-004',
    name: 'Luis Gómez',
    email: 'luis.gomez@logsentinel.demo',
    role: 'VIEWER',
    status: 'INACTIVE',
    lastAccess: minutesAgo(2_880),
    accessPolicy: {
      type: 'RESTRICTED',
      allowedDays: weekdaysOnly,
      startTime: '09:00',
      endTime: '18:00',
    },
    permissions: createPermissionsForRole('VIEWER'),
    recentActivity: [
      { id: 'ACT-008', timestamp: minutesAgo(2_880), description: 'Consultó el dashboard general.' },
    ],
  },
  {
    id: 'USR-005',
    name: 'Fernanda Ruiz',
    email: 'fernanda.ruiz@logsentinel.demo',
    role: 'VIEWER',
    status: 'SUSPENDED',
    lastAccess: minutesAgo(7_200),
    accessPolicy: {
      type: 'RESTRICTED',
      allowedDays: ['MON', 'WED', 'FRI'],
      startTime: '10:00',
      endTime: '16:00',
    },
    permissions: createPermissionsForRole('VIEWER'),
    recentActivity: [
      { id: 'ACT-009', timestamp: minutesAgo(7_200), description: 'Consultó alertas activas.' },
      { id: 'ACT-010', timestamp: minutesAgo(7_100), description: 'Cuenta suspendida en la demostración.' },
    ],
  },
  {
    id: 'USR-006',
    name: 'Diego Morales',
    email: 'diego.morales@logsentinel.demo',
    role: 'OPERATOR',
    status: 'ACTIVE',
    lastAccess: minutesAgo(18),
    accessPolicy: { type: 'ALWAYS', allowedDays: [], startTime: '00:00', endTime: '23:59' },
    permissions: createPermissionsForRole('OPERATOR'),
    recentActivity: [
      { id: 'ACT-011', timestamp: minutesAgo(18), description: 'Analizó el log log-2091.' },
      { id: 'ACT-012', timestamp: minutesAgo(28), description: 'Abrió el asistente IA mock.' },
    ],
  },
  {
    id: 'USR-007',
    name: 'Sofía Hernández',
    email: 'sofia.hernandez@logsentinel.demo',
    role: 'VIEWER',
    status: 'ACTIVE',
    lastAccess: null,
    accessPolicy: {
      type: 'RESTRICTED',
      allowedDays: weekdaysOnly,
      startTime: '08:30',
      endTime: '14:30',
    },
    permissions: createPermissionsForRole('VIEWER'),
    recentActivity: [],
  },
]
