import { Link } from 'react-router-dom'
import type { LogEntry } from '../../types/log'
import { Icon } from '../icons/Icon'
import { DetailDrawer } from '../ui/DetailDrawer'
import { SeverityBadge } from '../ui/SeverityBadge'

type LogDetailPanelProps = {
  log: LogEntry | null
  onClose: () => void
  onAnalyze: (log: LogEntry) => void
}

const fullDateFormatter = new Intl.DateTimeFormat('es-MX', {
  dateStyle: 'long',
  timeStyle: 'medium',
})

export function LogDetailPanel({ log, onClose, onAnalyze }: LogDetailPanelProps) {
  if (!log) return null

  return (
    <DetailDrawer
      headerContent={
        <div className="mb-2 flex items-center gap-2">
          <SeverityBadge severity={log.severity} />
          <span className="font-mono text-[10px] text-slate-400">{log.id}</span>
        </div>
      }
      onClose={onClose}
      title="Detalle del evento"
    >
      <p className="text-sm leading-6 text-slate-700">{log.message}</p>

      <button
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-ink-800 px-4 py-3 text-xs font-semibold text-white shadow-sm transition hover:bg-ink-700 sm:w-auto"
        onClick={() => onAnalyze(log)}
        type="button"
      >
        <Icon className="h-4 w-4 text-cyan-300" name="sparkles" />
        Explicar con IA
        <span className="rounded bg-white/10 px-1.5 py-0.5 text-[8px] uppercase tracking-wider text-slate-300">
          Mock
        </span>
      </button>

      <dl className="mt-6 grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:grid-cols-2">
        <div>
          <dt className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Fecha y hora</dt>
          <dd className="mt-1 text-xs font-medium text-slate-700">
            {fullDateFormatter.format(new Date(log.timestamp))}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Aplicación</dt>
          <dd className="mt-1 text-xs font-medium text-slate-700">{log.application}</dd>
        </div>
        <div>
          <dt className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Origen</dt>
          <dd className="mt-1 font-mono text-xs text-slate-700">{log.source}</dd>
        </div>
        <div>
          <dt className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Entorno</dt>
          <dd className="mt-1 text-xs font-medium capitalize text-slate-700">{log.environment}</dd>
        </div>
        <div>
          <dt className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Usuario</dt>
          <dd className="mt-1 text-xs font-medium text-slate-700">{log.user}</dd>
        </div>
        <div>
          <dt className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Duración</dt>
          <dd className="mt-1 text-xs font-medium text-slate-700">
            {log.durationMs.toLocaleString('es-MX')} ms
          </dd>
        </div>
      </dl>

      <div className="mt-6">
        <h3 className="text-xs font-semibold text-slate-800">Trazabilidad</h3>
        <div className="mt-3 rounded-xl border border-slate-200 px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Trace ID</p>
          <p className="mt-1 break-all font-mono text-xs text-cyan-700">{log.traceId}</p>
        </div>
        {log.incidentId && (
          <Link
            className="mt-3 flex items-center justify-between rounded-xl border border-rose-100 bg-rose-50/60 px-4 py-3 text-xs font-semibold text-rose-700 transition hover:bg-rose-50"
            onClick={onClose}
            to="/incidentes"
          >
            Incidente relacionado: {log.incidentId}
            <Icon className="h-4 w-4" name="chevron" />
          </Link>
        )}
      </div>

      <div className="mt-6">
        <h3 className="text-xs font-semibold text-slate-800">Metadata</h3>
        <dl className="mt-3 divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200">
          {Object.entries(log.metadata).map(([key, value]) => (
            <div className="grid grid-cols-[minmax(100px,0.45fr)_1fr] gap-4 px-4 py-3" key={key}>
              <dt className="truncate font-mono text-[10px] text-slate-400">{key}</dt>
              <dd className="break-all text-right font-mono text-[10px] text-slate-700">
                {String(value)}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-6">
        <h3 className="text-xs font-semibold text-slate-800">Registro original</h3>
        <pre className="mt-3 whitespace-pre-wrap break-words rounded-xl bg-ink-900 p-4 font-mono text-[11px] leading-5 text-slate-300 shadow-inner">
          {log.raw}
        </pre>
      </div>
    </DetailDrawer>
  )
}
