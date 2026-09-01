import type { AlertFiltersState, AlertStatus } from '../../types/alert'
import type { Severity } from '../../types/log'
import { Icon } from '../icons/Icon'

type AlertFiltersProps = {
  filters: AlertFiltersState
  applications: readonly string[]
  onChange: (filters: AlertFiltersState) => void
  onReset: () => void
}

const statusOptions: Array<{ value: AlertStatus | 'all'; label: string }> = [
  { value: 'all', label: 'Todos los estados' },
  { value: 'ACTIVE', label: 'Activas' },
  { value: 'INACTIVE', label: 'Inactivas' },
]

const severities: Array<Severity | 'all'> = ['all', 'INFO', 'WARNING', 'ERROR', 'CRITICAL']

export function AlertFilters({ filters, applications, onChange, onReset }: AlertFiltersProps) {
  const hasFilters =
    filters.search !== '' ||
    filters.status !== 'all' ||
    filters.severity !== 'all' ||
    filters.application !== 'all'

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-panel sm:p-5">
      <div className="grid gap-3 lg:grid-cols-[minmax(240px,1fr)_repeat(3,minmax(155px,0.36fr))_auto]">
        <label className="relative">
          <span className="sr-only">Buscar alertas</span>
          <Icon className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-400" name="search" />
          <input
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-3 text-xs text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white focus:ring-2 focus:ring-cyan-100"
            onChange={(event) => onChange({ ...filters, search: event.target.value })}
            placeholder="Buscar nombre o regla..."
            type="search"
            value={filters.search}
          />
        </label>

        <label className="relative">
          <span className="sr-only">Filtrar por estado</span>
          <select
            className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-3 pr-8 text-xs font-medium text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
            onChange={(event) =>
              onChange({ ...filters, status: event.target.value as AlertStatus | 'all' })
            }
            value={filters.status}
          >
            {statusOptions.map((status) => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
          <Icon className="pointer-events-none absolute right-3 top-3 h-4 w-4 rotate-90 text-slate-400" name="chevron" />
        </label>

        <label className="relative">
          <span className="sr-only">Filtrar por severidad</span>
          <select
            className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-3 pr-8 text-xs font-medium text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
            onChange={(event) =>
              onChange({ ...filters, severity: event.target.value as Severity | 'all' })
            }
            value={filters.severity}
          >
            {severities.map((severity) => (
              <option key={severity} value={severity}>
                {severity === 'all' ? 'Todas las severidades' : severity}
              </option>
            ))}
          </select>
          <Icon className="pointer-events-none absolute right-3 top-3 h-4 w-4 rotate-90 text-slate-400" name="chevron" />
        </label>

        <label className="relative">
          <span className="sr-only">Filtrar por aplicación</span>
          <select
            className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-3 pr-8 text-xs font-medium text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
            onChange={(event) => onChange({ ...filters, application: event.target.value })}
            value={filters.application}
          >
            <option value="all">Todas las aplicaciones</option>
            {applications.map((application) => (
              <option key={application} value={application}>{application}</option>
            ))}
          </select>
          <Icon className="pointer-events-none absolute right-3 top-3 h-4 w-4 rotate-90 text-slate-400" name="chevron" />
        </label>

        <button
          className="h-10 rounded-xl border border-slate-200 px-4 text-xs font-semibold text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
          disabled={!hasFilters}
          onClick={onReset}
          type="button"
        >
          Limpiar
        </button>
      </div>
    </div>
  )
}
