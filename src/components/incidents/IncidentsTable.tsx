import type { Incident } from '../../types/incident'
import { SeverityBadge } from '../ui/SeverityBadge'
import { IncidentStatusBadge } from './IncidentStatusBadge'

type IncidentsTableProps = {
  incidents: Incident[]
  onSelect: (incident: Incident) => void
}

const dateFormatter = new Intl.DateTimeFormat('es-MX', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
})

function formatDate(timestamp: string) {
  return dateFormatter.format(new Date(timestamp))
}

export function IncidentsTable({ incidents, onSelect }: IncidentsTableProps) {
  if (incidents.length === 0) {
    return (
      <div className="grid min-h-72 place-items-center px-6 text-center">
        <div>
          <p className="text-sm font-semibold text-slate-700">No hay incidentes con estos filtros</p>
          <p className="mt-1 text-xs text-slate-400">Selecciona otra combinación de estado y severidad.</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-3 p-4 md:hidden">
        {incidents.map((incident) => (
          <article className="rounded-xl border border-slate-200 p-4" key={incident.id}>
            <div className="flex items-start justify-between gap-3">
              <span className="font-mono text-[10px] font-semibold text-slate-400">{incident.id}</span>
              <SeverityBadge severity={incident.severity} />
            </div>
            <button
              className="mt-3 block w-full text-left text-sm font-semibold leading-5 text-slate-800 transition hover:text-cyan-700"
              onClick={() => onSelect(incident)}
              type="button"
            >
              {incident.title}
            </button>
            <p className="mt-2 text-xs text-slate-500">{incident.application}</p>
            <div className="mt-4 flex items-center justify-between gap-3">
              <span className="text-[10px] text-slate-400">{formatDate(incident.detectedAt)}</span>
              <IncidentStatusBadge status={incident.status} />
            </div>
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[920px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              <th className="px-6 py-3.5">ID</th>
              <th className="px-4 py-3.5">Título</th>
              <th className="px-4 py-3.5">Severidad</th>
              <th className="px-4 py-3.5">Aplicación</th>
              <th className="px-4 py-3.5">Detectado</th>
              <th className="px-6 py-3.5 text-right">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {incidents.map((incident) => (
              <tr className="group transition-colors hover:bg-slate-50/70" key={incident.id}>
                <td className="whitespace-nowrap px-6 py-4 font-mono text-[10px] font-semibold text-slate-500">
                  {incident.id}
                </td>
                <td className="max-w-md px-4 py-4">
                  <button
                    className="block w-full truncate text-left text-xs font-semibold text-slate-700 transition hover:text-cyan-700"
                    onClick={() => onSelect(incident)}
                    title={incident.title}
                    type="button"
                  >
                    {incident.title}
                  </button>
                  <p className="mt-1 truncate text-[10px] text-slate-400">{incident.assignee}</p>
                </td>
                <td className="px-4 py-4"><SeverityBadge severity={incident.severity} /></td>
                <td className="whitespace-nowrap px-4 py-4 text-xs font-medium text-slate-600">
                  {incident.application}
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-[11px] text-slate-500">
                  {formatDate(incident.detectedAt)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right">
                  <IncidentStatusBadge status={incident.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
