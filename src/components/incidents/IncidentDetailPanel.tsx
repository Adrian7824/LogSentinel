import { Link } from 'react-router-dom'
import type { Incident } from '../../types/incident'
import { Icon } from '../icons/Icon'
import { SeverityBadge } from '../ui/SeverityBadge'
import { DetailDrawer } from '../ui/DetailDrawer'
import { IncidentStatusBadge } from './IncidentStatusBadge'

type IncidentDetailPanelProps = {
  incident: Incident | null
  onClose: () => void
  onAnalyze: (incident: Incident) => void
}

const fullDateFormatter = new Intl.DateTimeFormat('es-MX', {
  dateStyle: 'long',
  timeStyle: 'short',
})

export function IncidentDetailPanel({ incident, onClose, onAnalyze }: IncidentDetailPanelProps) {
  if (!incident) return null

  return (
    <DetailDrawer
      headerContent={
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <SeverityBadge severity={incident.severity} />
          <IncidentStatusBadge status={incident.status} />
          <span className="font-mono text-[10px] text-slate-400">{incident.id}</span>
        </div>
      }
      onClose={onClose}
      title="Detalle del incidente"
    >
      <h3 className="text-base font-semibold leading-6 text-slate-900">{incident.title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{incident.description}</p>

      <button
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-ink-800 px-4 py-3 text-xs font-semibold text-white shadow-sm transition hover:bg-ink-700 sm:w-auto"
        onClick={() => onAnalyze(incident)}
        type="button"
      >
        <Icon className="h-4 w-4 text-cyan-300" name="sparkles" />
        Analizar con IA
        <span className="rounded bg-white/10 px-1.5 py-0.5 text-[8px] uppercase tracking-wider text-slate-300">
          Mock
        </span>
      </button>

      <dl className="mt-6 grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:grid-cols-2">
        <div>
          <dt className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Aplicación</dt>
          <dd className="mt-1 text-xs font-medium text-slate-700">{incident.application}</dd>
        </div>
        <div>
          <dt className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Responsable</dt>
          <dd className="mt-1 text-xs font-medium text-slate-700">{incident.assignee}</dd>
        </div>
        <div>
          <dt className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Detectado</dt>
          <dd className="mt-1 text-xs font-medium text-slate-700">
            {fullDateFormatter.format(new Date(incident.detectedAt))}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Última actualización</dt>
          <dd className="mt-1 text-xs font-medium text-slate-700">
            {fullDateFormatter.format(new Date(incident.updatedAt))}
          </dd>
        </div>
      </dl>

      <div className="mt-6 rounded-xl border border-slate-200 px-4 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Origen de detección</p>
        <p className="mt-1 text-xs font-medium text-slate-700">{incident.source}</p>
      </div>

      <div className="mt-7">
        <h3 className="text-xs font-semibold text-slate-800">Actividad del incidente</h3>
        <ol className="mt-4 space-y-0">
          {incident.updates.map((update, index) => (
            <li className="relative grid grid-cols-[20px_1fr] gap-3 pb-5" key={update.id}>
              {index < incident.updates.length - 1 && (
                <span className="absolute left-[9px] top-3 h-full w-px bg-slate-200" />
              )}
              <span className="relative mt-1 h-5 w-5 rounded-full border-4 border-white bg-cyan-500 ring-1 ring-cyan-200" />
              <div>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs font-semibold text-slate-700">{update.author}</p>
                  <time className="text-[10px] text-slate-400">
                    {fullDateFormatter.format(new Date(update.timestamp))}
                  </time>
                </div>
                <p className="mt-1 text-xs leading-5 text-slate-500">{update.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-2">
        <h3 className="text-xs font-semibold text-slate-800">Logs relacionados</h3>
        <div className="mt-3 space-y-2">
          {incident.relatedLogIds.map((logId) => (
            <Link
              className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 font-mono text-xs text-cyan-700 transition hover:border-cyan-200 hover:bg-cyan-50/40"
              key={logId}
              onClick={onClose}
              to="/logs"
            >
              {logId}
              <Icon className="h-4 w-4" name="chevron" />
            </Link>
          ))}
        </div>
      </div>
    </DetailDrawer>
  )
}
