import type { UserFiltersState, UserRole, UserStatus } from '../../types/user'
import { Icon } from '../icons/Icon'

type UserFiltersProps = {
  filters: UserFiltersState
  onChange: (filters: UserFiltersState) => void
  onReset: () => void
}

const roles: Array<{ value: UserRole | 'all'; label: string }> = [
  { value: 'all', label: 'Todos los roles' },
  { value: 'ADMIN', label: 'Administrador' },
  { value: 'OPERATOR', label: 'Operador / Analista' },
  { value: 'VIEWER', label: 'Visualizador' },
]

const statuses: Array<{ value: UserStatus | 'all'; label: string }> = [
  { value: 'all', label: 'Todos los estados' },
  { value: 'ACTIVE', label: 'Activos' },
  { value: 'INACTIVE', label: 'Inactivos' },
  { value: 'SUSPENDED', label: 'Suspendidos' },
]

export function UserFilters({ filters, onChange, onReset }: UserFiltersProps) {
  const hasFilters =
    filters.search !== '' || filters.role !== 'all' || filters.status !== 'all'

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-panel sm:p-5">
      <div className="grid gap-3 lg:grid-cols-[minmax(240px,1fr)_repeat(2,minmax(170px,0.35fr))_auto]">
        <label className="relative">
          <span className="sr-only">Buscar usuarios</span>
          <Icon
            className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-400"
            name="search"
          />
          <input
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-3 text-xs text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white focus:ring-2 focus:ring-cyan-100"
            onChange={(event) => onChange({ ...filters, search: event.target.value })}
            placeholder="Buscar nombre o correo..."
            type="search"
            value={filters.search}
          />
        </label>

        <label className="relative">
          <span className="sr-only">Filtrar por rol</span>
          <select
            className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-3 pr-8 text-xs font-medium text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
            onChange={(event) =>
              onChange({ ...filters, role: event.target.value as UserRole | 'all' })
            }
            value={filters.role}
          >
            {roles.map((role) => (
              <option key={role.value} value={role.value}>{role.label}</option>
            ))}
          </select>
          <Icon className="pointer-events-none absolute right-3 top-3 h-4 w-4 rotate-90 text-slate-400" name="chevron" />
        </label>

        <label className="relative">
          <span className="sr-only">Filtrar por estado</span>
          <select
            className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-3 pr-8 text-xs font-medium text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
            onChange={(event) =>
              onChange({ ...filters, status: event.target.value as UserStatus | 'all' })
            }
            value={filters.status}
          >
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>{status.label}</option>
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
