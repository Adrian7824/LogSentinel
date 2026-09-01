import { Icon } from '../icons/Icon'
import type { IncidentFiltersState, IncidentStatus } from '../../types/incident'
import type { Severity } from '../../types/log'

type IncidentFiltersProps = {
  filters: IncidentFiltersState
  onChange: (filters: IncidentFiltersState) => void
  onReset: () => void
}

const statuses: Array<{ value: IncidentStatus | 'all'; label: string }> = [
  { value: 'all', label: 'Todos los estados' },
  { value: 'OPEN', label: 'Abiertos' },
  { value: 'INVESTIGATING', label: 'Investigando' },
  { value: 'RESOLVED', label: 'Resueltos' },
]

const severities: Array<Severity | 'all'> = ['all', 'WARNING', 'ERROR', 'CRITICAL']

export function IncidentFilters({ filters, onChange, onReset }: IncidentFiltersProps) {
  const hasFilters = filters.status !== 'all' || filters.severity !== 'all'

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-panel sm:flex-row sm:items-center sm:p-5">
      <div className="flex items-center gap-2 sm:mr-2">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-500">
          <Icon className="h-4 w-4" name="incidents" />
        </span>
        <div>
          <p className="text-xs font-semibold text-slate-700">Filtrar incidentes</p>
          <p className="text-[10px] text-slate-400">Estado y severidad</p>
        </div>
      </div>

      <label className="relative sm:ml-auto sm:w-48">
        <span className="sr-only">Filtrar por estado</span>
        <select
          className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-3 pr-8 text-xs font-medium text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
          onChange={(event) =>
            onChange({ ...filters, status: event.target.value as IncidentStatus | 'all' })
          }
          value={filters.status}
        >
          {statuses.map((status) => (
            <option key={status.value} value={status.value}>{status.label}</option>
          ))}
        </select>
        <Icon className="pointer-events-none absolute right-3 top-3 h-4 w-4 rotate-90 text-slate-400" name="chevron" />
      </label>

      <label className="relative sm:w-52">
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

      <button
        className="h-10 rounded-xl border border-slate-200 px-4 text-xs font-semibold text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
        disabled={!hasFilters}
        onClick={onReset}
        type="button"
      >
        Limpiar
      </button>
    </div>
  )
}
