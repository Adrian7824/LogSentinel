import type { AlertRule } from '../../types/alert'
import { SeverityBadge } from '../ui/SeverityBadge'
import { AlertStatusBadge } from './AlertStatusBadge'
import { AlertToggle } from './AlertToggle'

type AlertsTableProps = {
  alerts: AlertRule[]
  onToggle: (alertId: string) => void
}

const dateFormatter = new Intl.DateTimeFormat('es-MX', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
})

function formatDate(timestamp: string | null) {
  return timestamp ? dateFormatter.format(new Date(timestamp)) : 'Sin activaciones'
}

export function AlertsTable({ alerts, onToggle }: AlertsTableProps) {
  if (alerts.length === 0) {
    return (
      <div className="grid min-h-72 place-items-center px-6 text-center">
        <div>
          <p className="text-sm font-semibold text-slate-700">No hay alertas con estos filtros</p>
          <p className="mt-1 text-xs text-slate-400">Prueba otra combinación de búsqueda y filtros.</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-3 p-4 md:hidden">
        {alerts.map((alert) => (
          <article className="rounded-xl border border-slate-200 p-4" key={alert.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold leading-5 text-slate-800">{alert.name}</p>
                <p className="mt-1 text-xs text-slate-500">{alert.application}</p>
              </div>
              <SeverityBadge severity={alert.severity} />
            </div>
            <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 font-mono text-[10px] leading-5 text-slate-500">
              {alert.rule}
            </p>
            <div className="mt-4 flex items-center justify-between gap-3">
              <AlertStatusBadge status={alert.status} />
              <AlertToggle
                label={alert.name}
                onToggle={() => onToggle(alert.id)}
                status={alert.status}
              />
            </div>
            <p className="mt-3 text-[10px] text-slate-400">
              Última activación: {formatDate(alert.lastTriggeredAt)}
            </p>
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[1060px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              <th className="px-6 py-3.5">Nombre</th>
              <th className="px-4 py-3.5">Regla</th>
              <th className="px-4 py-3.5">Aplicación</th>
              <th className="px-4 py-3.5">Severidad</th>
              <th className="px-4 py-3.5">Estado</th>
              <th className="px-4 py-3.5">Última activación</th>
              <th className="px-6 py-3.5 text-right">Habilitada</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {alerts.map((alert) => (
              <tr className="group transition-colors hover:bg-slate-50/70" key={alert.id}>
                <td className="max-w-[220px] px-6 py-4">
                  <p className="truncate text-xs font-semibold text-slate-700" title={alert.name}>
                    {alert.name}
                  </p>
                  <p className="mt-1 font-mono text-[9px] text-slate-400">{alert.id}</p>
                </td>
                <td className="max-w-[300px] px-4 py-4">
                  <p className="truncate font-mono text-[10px] text-slate-500" title={alert.rule}>
                    {alert.rule}
                  </p>
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-xs font-medium text-slate-600">
                  {alert.application}
                </td>
                <td className="px-4 py-4"><SeverityBadge severity={alert.severity} /></td>
                <td className="px-4 py-4"><AlertStatusBadge status={alert.status} /></td>
                <td className="whitespace-nowrap px-4 py-4">
                  <p className="text-[11px] text-slate-500">{formatDate(alert.lastTriggeredAt)}</p>
                  <p className="mt-1 text-[9px] text-slate-400">
                    {alert.triggerCount24h} activaciones en 24 h
                  </p>
                </td>
                <td className="px-6 py-4 text-right">
                  <AlertToggle
                    label={alert.name}
                    onToggle={() => onToggle(alert.id)}
                    status={alert.status}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
