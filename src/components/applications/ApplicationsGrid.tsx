import type {
  ApplicationStats,
  ApplicationStatus,
  MonitoredApplication,
} from '../../types/application'
import { Icon } from '../icons/Icon'
import { ApplicationStatusBadge } from './ApplicationStatusBadge'

export type ApplicationGridItem = {
  application: MonitoredApplication
  stats: ApplicationStats
}

type ApplicationsGridProps = {
  items: ApplicationGridItem[]
  onSelect: (application: MonitoredApplication) => void
  onEdit: (application: MonitoredApplication) => void
  onToggleMonitoring: (applicationId: string) => void
}

const dateFormatter = new Intl.DateTimeFormat('es-MX', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
})

function getEffectiveStatus(application: MonitoredApplication): ApplicationStatus {
  return application.monitored ? application.health : 'PAUSED'
}

export function ApplicationsGrid({
  items,
  onSelect,
  onEdit,
  onToggleMonitoring,
}: ApplicationsGridProps) {
  if (items.length === 0) {
    return (
      <div className="grid min-h-72 place-items-center rounded-2xl border border-slate-200 bg-white px-6 text-center shadow-panel">
        <div>
          <p className="text-sm font-semibold text-slate-700">No hay aplicaciones con estos filtros</p>
          <p className="mt-1 text-xs text-slate-400">Prueba otra búsqueda, estado o entorno.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
      {items.map(({ application, stats }) => (
        <article
          className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-panel transition hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-lg"
          key={application.id}
        >
          <div className="p-5">
            <div className="flex items-start justify-between gap-3">
              <button
                className="flex min-w-0 items-start gap-3 text-left"
                onClick={() => onSelect(application)}
                type="button"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-ink-800 text-white shadow-sm">
                  <Icon className="h-5 w-5 text-cyan-300" name="apps" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-slate-800 transition group-hover:text-cyan-700">
                    {application.name}
                  </span>
                  <span className="mt-1 block font-mono text-[9px] text-slate-400">
                    {application.id} · v{application.version}
                  </span>
                </span>
              </button>
              <ApplicationStatusBadge status={getEffectiveStatus(application)} />
            </div>

            <p className="mt-4 line-clamp-2 min-h-10 text-xs leading-5 text-slate-500">
              {application.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              <span className="rounded-md bg-slate-100 px-2 py-1 text-[9px] font-semibold capitalize text-slate-600">
                {application.environment}
              </span>
              <span className="rounded-md bg-slate-100 px-2 py-1 text-[9px] font-semibold text-slate-600">
                {application.team}
              </span>
              {application.technologies.slice(0, 2).map((technology) => (
                <span className="rounded-md bg-cyan-50 px-2 py-1 text-[9px] font-semibold text-cyan-700" key={technology}>
                  {technology}
                </span>
              ))}
            </div>

            <dl className="mt-5 grid grid-cols-3 divide-x divide-slate-100 rounded-xl border border-slate-100 bg-slate-50/70 py-3 text-center">
              <div className="px-2">
                <dt className="text-[8px] font-semibold uppercase tracking-wider text-slate-400">Logs</dt>
                <dd className="mt-1 text-sm font-semibold text-slate-700">{stats.logCount}</dd>
              </div>
              <div className="px-2">
                <dt className="text-[8px] font-semibold uppercase tracking-wider text-slate-400">Errores</dt>
                <dd className="mt-1 text-sm font-semibold text-rose-600">{stats.errorCount}</dd>
              </div>
              <div className="px-2">
                <dt className="text-[8px] font-semibold uppercase tracking-wider text-slate-400">Incidentes</dt>
                <dd className="mt-1 text-sm font-semibold text-amber-600">{stats.activeIncidentCount}</dd>
              </div>
            </dl>

            <p className="mt-4 text-[9px] text-slate-400">
              Último evento: {stats.lastEventAt ? dateFormatter.format(new Date(stats.lastEventAt)) : 'Sin datos mock'}
            </p>
          </div>

          <div className="flex gap-2 border-t border-slate-100 bg-slate-50/40 px-5 py-3">
            <button
              className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[10px] font-semibold text-slate-600 transition hover:border-cyan-200 hover:text-cyan-700"
              onClick={() => onEdit(application)}
              type="button"
            >
              Editar
            </button>
            <button
              className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[10px] font-semibold text-slate-600 transition hover:border-cyan-200 hover:text-cyan-700"
              onClick={() => onToggleMonitoring(application.id)}
              type="button"
            >
              {application.monitored ? 'Pausar' : 'Reanudar'}
            </button>
            <button
              aria-label={`Ver detalle de ${application.name}`}
              className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-cyan-50 hover:text-cyan-700"
              onClick={() => onSelect(application)}
              type="button"
            >
              <Icon className="h-4 w-4" name="chevron" />
            </button>
          </div>
        </article>
      ))}
    </div>
  )
}
