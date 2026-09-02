import { Link } from 'react-router-dom'
import type {
  ApplicationContext,
  ApplicationStatus,
  MonitoredApplication,
} from '../../types/application'
import { Icon } from '../icons/Icon'
import { DetailDrawer } from '../ui/DetailDrawer'
import { SeverityBadge } from '../ui/SeverityBadge'
import { ApplicationStatusBadge } from './ApplicationStatusBadge'

type ApplicationDetailPanelProps = {
  application: MonitoredApplication | null
  context: ApplicationContext | null
  onClose: () => void
  onEdit: (application: MonitoredApplication) => void
  onToggleMonitoring: (applicationId: string) => void
}

const fullDateFormatter = new Intl.DateTimeFormat('es-MX', {
  dateStyle: 'long',
  timeStyle: 'short',
})

function getEffectiveStatus(application: MonitoredApplication): ApplicationStatus {
  return application.monitored ? application.health : 'PAUSED'
}

export function ApplicationDetailPanel({
  application,
  context,
  onClose,
  onEdit,
  onToggleMonitoring,
}: ApplicationDetailPanelProps) {
  if (!application || !context) return null

  return (
    <DetailDrawer
      headerContent={
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <ApplicationStatusBadge status={getEffectiveStatus(application)} />
          <span className="font-mono text-[10px] text-slate-400">{application.id}</span>
        </div>
      }
      onClose={onClose}
      title="Detalle de la aplicación"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900">{application.name}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{application.description}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            className="rounded-xl border border-slate-200 px-3 py-2 text-[10px] font-semibold text-slate-600 transition hover:border-cyan-200 hover:text-cyan-700"
            onClick={() => onEdit(application)}
            type="button"
          >
            Editar
          </button>
          <button
            className="rounded-xl bg-ink-800 px-3 py-2 text-[10px] font-semibold text-white transition hover:bg-ink-700"
            onClick={() => onToggleMonitoring(application.id)}
            type="button"
          >
            {application.monitored ? 'Pausar' : 'Reanudar'}
          </button>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-cyan-200 bg-cyan-50/60 px-4 py-3 text-[10px] leading-5 text-cyan-800">
        Vista de demostración basada en datos locales. Esta aplicación no tiene una conexión real asociada.
      </div>

      <dl className="mt-6 grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:grid-cols-2">
        <div>
          <dt className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Equipo responsable</dt>
          <dd className="mt-1 text-xs font-medium text-slate-700">{application.team}</dd>
        </div>
        <div>
          <dt className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Versión</dt>
          <dd className="mt-1 font-mono text-xs text-slate-700">v{application.version}</dd>
        </div>
        <div>
          <dt className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Entorno</dt>
          <dd className="mt-1 text-xs font-medium capitalize text-slate-700">{application.environment}</dd>
        </div>
        <div>
          <dt className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Último despliegue</dt>
          <dd className="mt-1 text-xs font-medium text-slate-700">
            {application.lastDeploymentAt
              ? fullDateFormatter.format(new Date(application.lastDeploymentAt))
              : 'Sin despliegues registrados'}
          </dd>
        </div>
      </dl>

      <section className="mt-7">
        <h3 className="text-xs font-semibold text-slate-800">Resumen de observabilidad mock</h3>
        <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[
            ['Logs', context.stats.logCount],
            ['Errores', context.stats.errorCount],
            ['Incidentes activos', context.stats.activeIncidentCount],
            ['Alertas activas', context.stats.activeAlertCount],
            ['Duración promedio', `${context.stats.averageDurationMs} ms`],
          ].map(([label, value]) => (
            <div className="rounded-xl border border-slate-200 p-3" key={label}>
              <dt className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">{label}</dt>
              <dd className="mt-1 text-sm font-semibold text-slate-700">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-7">
        <h3 className="text-xs font-semibold text-slate-800">Tecnologías declaradas</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {application.technologies.map((technology) => (
            <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-[10px] font-semibold text-slate-600" key={technology}>
              {technology}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-7">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-xs font-semibold text-slate-800">Eventos recientes</h3>
          <Link
            className="text-[10px] font-semibold text-cyan-700 hover:text-cyan-800"
            onClick={onClose}
            to={`/logs?search=${encodeURIComponent(application.name)}`}
          >
            Ver todos
          </Link>
        </div>
        {context.recentLogs.length > 0 ? (
          <div className="mt-3 divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200">
            {context.recentLogs.map((log) => (
              <Link
                className="flex items-start justify-between gap-3 px-4 py-3 transition hover:bg-slate-50"
                key={log.id}
                onClick={onClose}
                to={`/logs?log=${log.id}`}
              >
                <span className="min-w-0">
                  <span className="block truncate text-[11px] font-semibold text-slate-700">{log.message}</span>
                  <span className="mt-1 block font-mono text-[9px] text-slate-400">{log.id} · {log.traceId}</span>
                </span>
                <SeverityBadge severity={log.severity} />
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-3 rounded-xl border border-dashed border-slate-200 p-4 text-xs text-slate-400">
            No hay eventos mock asociados con esta aplicación.
          </p>
        )}
      </section>

      <section className="mt-7 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Incidentes relacionados</p>
          <p className="mt-2 text-lg font-semibold text-slate-800">{context.incidents.length}</p>
          <Link
            className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold text-cyan-700"
            onClick={onClose}
            to={context.incidents[0] ? `/incidentes?incident=${context.incidents[0].id}` : '/incidentes'}
          >
            Revisar incidentes <Icon className="h-3 w-3" name="chevron" />
          </Link>
        </div>
        <div className="rounded-xl border border-slate-200 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Reglas de alerta</p>
          <p className="mt-2 text-lg font-semibold text-slate-800">{context.alerts.length}</p>
          <Link
            className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold text-cyan-700"
            onClick={onClose}
            to="/alertas"
          >
            Revisar alertas <Icon className="h-3 w-3" name="chevron" />
          </Link>
        </div>
      </section>
    </DetailDrawer>
  )
}
