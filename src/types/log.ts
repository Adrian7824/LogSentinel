export type Severity = 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL'

export type LogTimeRange = '1h' | '24h' | '7d' | '30d' | 'all'

export type LogEntry = {
  id: string
  timestamp: string
  application: string
  severity: Severity
  message: string
  source: string
  environment: 'production' | 'staging' | 'development'
  user: string
  traceId: string
  durationMs: number
  incidentId?: string
  metadata: Record<string, string | number | boolean>
  raw: string
}

export type LogFiltersState = {
  search: string
  severity: Severity | 'all'
  application: string
  timeRange: LogTimeRange
}
