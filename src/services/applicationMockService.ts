import { mockAlerts } from '../data/alertsMock'
import { mockApplications } from '../data/applicationsMock'
import { mockIncidents } from '../data/incidentsMock'
import { mockLogs } from '../data/logsMock'
import type {
  ApplicationContext,
  ApplicationStats,
  MonitoredApplication,
} from '../types/application'

let sessionApplications = mockApplications

export function getSessionApplications() {
  return sessionApplications
}

export function saveSessionApplications(applications: MonitoredApplication[]) {
  sessionApplications = applications
}

export function getApplicationStats(applicationName: string): ApplicationStats {
  const logs = mockLogs.filter((log) => log.application === applicationName)
  const errors = logs.filter((log) => log.severity === 'ERROR' || log.severity === 'CRITICAL')
  const activeIncidents = mockIncidents.filter(
    (incident) => incident.application === applicationName && incident.status !== 'RESOLVED',
  )
  const activeAlerts = mockAlerts.filter(
    (alert) => alert.application === applicationName && alert.status === 'ACTIVE',
  )
  const totalDuration = logs.reduce((total, log) => total + log.durationMs, 0)

  return {
    logCount: logs.length,
    errorCount: errors.length,
    activeIncidentCount: activeIncidents.length,
    activeAlertCount: activeAlerts.length,
    averageDurationMs: logs.length > 0 ? Math.round(totalDuration / logs.length) : 0,
    lastEventAt: logs[0]?.timestamp ?? null,
  }
}

export function getApplicationContext(applicationName: string): ApplicationContext {
  return {
    stats: getApplicationStats(applicationName),
    recentLogs: mockLogs.filter((log) => log.application === applicationName).slice(0, 3),
    incidents: mockIncidents.filter((incident) => incident.application === applicationName).slice(0, 3),
    alerts: mockAlerts.filter((alert) => alert.application === applicationName).slice(0, 3),
  }
}
