import type { IconName } from '../components/icons/Icon'
import type { Severity } from './log'

export type { Severity } from './log'

export type TimeRange = '24h' | '7d' | '30d'

export type MetricAccent = 'cyan' | 'rose' | 'indigo' | 'emerald' | 'amber'

export type DashboardMetric = {
  id: string
  label: string
  value: string
  helper: string
  trend: string
  trendDirection: 'up' | 'down' | 'flat'
  trendTone: 'positive' | 'negative' | 'neutral'
  icon: IconName
  accent: MetricAccent
}

export type LogDataPoint = {
  label: string
  value: number
}

export type SeverityData = {
  severity: Severity
  count: number
}

export type EventStatus = 'Nuevo' | 'Investigando' | 'Monitoreando' | 'Resuelto'

export type RecentEvent = {
  id: string
  time: string
  date: string
  application: string
  severity: Severity
  message: string
  user: string
  status: EventStatus
}
