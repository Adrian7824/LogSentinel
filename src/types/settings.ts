import type { Severity } from './log'
import type { UserRole } from './user'

export type SettingsSectionId =
  | 'general'
  | 'observability'
  | 'retention'
  | 'notifications'
  | 'security'
  | 'connections'

export type GeneralSettings = {
  environmentName: string
  timezone: string
  language: 'es-MX' | 'en-US'
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD'
  defaultLogLevel: Severity
}

export type ObservabilitySettings = {
  visibleSeverities: Severity[]
  autoRefresh: boolean
  refreshIntervalSeconds: 5 | 15 | 30 | 60
  eventLimit: 50 | 100 | 250 | 500
  showResolvedIncidents: boolean
  compactDashboard: boolean
}

export type RetentionPeriod = 7 | 30 | 90 | 'CUSTOM'

export type RetentionSettings = {
  period: RetentionPeriod
  customDays: number
  archiveBeforeDelete: boolean
}

export type IntegrationStatus = 'NOT_CONFIGURED' | 'DEMO'

export type NotificationSettings = {
  webhook: {
    status: IntegrationStatus
    name: string
    url: string
  }
  smtp: {
    status: IntegrationStatus
    host: string
    port: number
    sender: string
  }
}

export type SecuritySettings = {
  sessionTimeoutMinutes: 15 | 30 | 60 | 120
  allowConcurrentSessions: boolean
  defaultRole: UserRole
  auditEnabled: boolean
  auditRetentionDays: 30 | 60 | 90
}

export type ConnectionSettings = {
  urlConnectionsEnabled: boolean
  sshConnectionsEnabled: boolean
  connectionTimeoutSeconds: 10 | 30 | 60
  verifyHostIdentity: boolean
}

export type LogSentinelSettings = {
  general: GeneralSettings
  observability: ObservabilitySettings
  retention: RetentionSettings
  notifications: NotificationSettings
  security: SecuritySettings
  connections: ConnectionSettings
}
