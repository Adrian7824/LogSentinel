import type { Severity } from './log'

export type IncidentStatus = 'OPEN' | 'INVESTIGATING' | 'RESOLVED'

export type IncidentUpdate = {
  id: string
  timestamp: string
  author: string
  description: string
}

export type Incident = {
  id: string
  title: string
  description: string
  severity: Severity
  application: string
  detectedAt: string
  updatedAt: string
  status: IncidentStatus
  assignee: string
  source: string
  relatedLogIds: string[]
  updates: IncidentUpdate[]
}

export type IncidentFiltersState = {
  status: IncidentStatus | 'all'
  severity: Severity | 'all'
}
