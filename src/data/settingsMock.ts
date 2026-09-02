import type { LogSentinelSettings } from '../types/settings'

export const initialSettingsMock: LogSentinelSettings = {
  general: {
    environmentName: 'Producción Demo',
    timezone: 'America/Mexico_City',
    language: 'es-MX',
    dateFormat: 'DD/MM/YYYY',
    defaultLogLevel: 'INFO',
  },
  observability: {
    visibleSeverities: ['INFO', 'WARNING', 'ERROR', 'CRITICAL'],
    autoRefresh: true,
    refreshIntervalSeconds: 15,
    eventLimit: 100,
    showResolvedIncidents: true,
    compactDashboard: false,
  },
  retention: {
    period: 30,
    customDays: 45,
    archiveBeforeDelete: true,
  },
  notifications: {
    webhook: {
      status: 'NOT_CONFIGURED',
      name: '',
      url: '',
    },
    smtp: {
      status: 'DEMO',
      host: 'smtp.demo.local',
      port: 587,
      sender: 'alertas@logsentinel.demo',
    },
  },
  security: {
    sessionTimeoutMinutes: 60,
    allowConcurrentSessions: false,
    defaultRole: 'VIEWER',
    auditEnabled: true,
    auditRetentionDays: 90,
  },
  connections: {
    urlConnectionsEnabled: true,
    sshConnectionsEnabled: false,
    connectionTimeoutSeconds: 30,
    verifyHostIdentity: true,
  },
}
