export type ApplicationHealth = 'HEALTHY' | 'DEGRADED' | 'CRITICAL'

export type ApplicationEnvironment = 'production' | 'staging' | 'development'

export type ApplicationStatus = ApplicationHealth | 'PAUSED'

export type MonitoredApplication = {
  id: string
  name: string
  description: string
  team: string
  version: string
  environment: ApplicationEnvironment
  health: ApplicationHealth
  monitored: boolean
  lastDeploymentAt: string | null
  technologies: string[]
}

export type ApplicationStats = {
  logCount: number
  errorCount: number
  activeIncidentCount: number
  activeAlertCount: number
  averageDurationMs: number
  lastEventAt: string | null
}

export type ApplicationContext = {
  stats: ApplicationStats
  recentLogs: LogEntry[]
  incidents: Incident[]
  alerts: AlertRule[]
}

export type ApplicationFiltersState = {
  search: string
  status: ApplicationStatus | 'all'
  environment: ApplicationEnvironment | 'all'
}
import type { AlertRule } from './alert'
import type { Incident } from './incident'
import type { LogEntry } from './log'
