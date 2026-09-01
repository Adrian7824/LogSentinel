import { useMemo, useState } from 'react'
import { Icon } from '../components/icons/Icon'
import { LogDetailPanel } from '../components/logs/LogDetailPanel'
import { LogFilters } from '../components/logs/LogFilters'
import { LogsTable } from '../components/logs/LogsTable'
import { Pagination } from '../components/ui/Pagination'
import { logApplications, mockLogs } from '../data/logsMock'
import type { LogEntry, LogFiltersState, LogTimeRange } from '../types/log'

const pageSize = 7

const initialFilters: LogFiltersState = {
  search: '',
  severity: 'all',
  application: 'all',
  timeRange: '24h',
}

const rangeInMilliseconds: Record<Exclude<LogTimeRange, 'all'>, number> = {
  '1h': 60 * 60 * 1000,
  '24h': 24 * 60 * 60 * 1000,
  '7d': 7 * 24 * 60 * 60 * 1000,
  '30d': 30 * 24 * 60 * 60 * 1000,
}

export function LogsPage() {
  const [filters, setFilters] = useState<LogFiltersState>(initialFilters)
  const [page, setPage] = useState(1)
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null)

  const filteredLogs = useMemo(() => {
    const normalizedSearch = filters.search.trim().toLocaleLowerCase('es-MX')
    const now = Date.now()

    return mockLogs.filter((log) => {
      const matchesSearch =
        normalizedSearch === '' ||
        [log.message, log.application, log.source, log.user, log.traceId, log.raw]
          .join(' ')
          .toLocaleLowerCase('es-MX')
          .includes(normalizedSearch)
      const matchesSeverity = filters.severity === 'all' || log.severity === filters.severity
      const matchesApplication =
        filters.application === 'all' || log.application === filters.application
      const matchesTime =
        filters.timeRange === 'all' ||
        now - new Date(log.timestamp).getTime() <= rangeInMilliseconds[filters.timeRange]

      return matchesSearch && matchesSeverity && matchesApplication && matchesTime
    })
  }, [filters])

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const visibleLogs = filteredLogs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  )

  const updateFilters = (nextFilters: LogFiltersState) => {
    setFilters(nextFilters)
    setPage(1)
  }

  return (
    <section aria-labelledby="logs-title" className="mx-auto max-w-[1500px]">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400">
            <span>LogSentinel</span>
            <Icon className="h-3.5 w-3.5" name="chevron" />
            <span className="text-slate-600">Logs</span>
          </div>
          <h2
            className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl"
            id="logs-title"
          >
            Explorador de logs
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Busca, filtra e inspecciona los eventos generados por tus aplicaciones.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-50" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500" />
          </span>
          Fuente de demostración
        </div>
      </div>

      <LogFilters
        applications={logApplications}
        filters={filters}
        onChange={updateFilters}
        onReset={() => updateFilters(initialFilters)}
      />

      <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-panel">
        <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Eventos registrados</h3>
            <p className="mt-1 text-xs text-slate-500">
              {filteredLogs.length} {filteredLogs.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
            </p>
          </div>
          <p className="font-mono text-[10px] text-slate-400">Orden: más recientes primero</p>
        </div>

        <LogsTable logs={visibleLogs} onSelect={setSelectedLog} />
        <Pagination
          currentPage={currentPage}
          onPageChange={setPage}
          pageSize={pageSize}
          totalItems={filteredLogs.length}
          totalPages={totalPages}
        />
      </div>

      <LogDetailPanel log={selectedLog} onClose={() => setSelectedLog(null)} />
    </section>
  )
}
