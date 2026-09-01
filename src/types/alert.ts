import type { Severity } from './log'

export type AlertStatus = 'ACTIVE' | 'INACTIVE'

export type AlertRule = {
  id: string
  name: string
  rule: string
  application: string
  severity: Severity
  status: AlertStatus
  lastTriggeredAt: string | null
  triggerCount24h: number
}

export type AlertFiltersState = {
  search: string
  status: AlertStatus | 'all'
  severity: Severity | 'all'
  application: string
}
