import type { LogEntry } from '../../types/log'
import { SeverityBadge } from '../ui/SeverityBadge'

type LogsTableProps = {
  logs: LogEntry[]
  onSelect: (log: LogEntry) => void
}

const dateFormatter = new Intl.DateTimeFormat('es-MX', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
})

function formatDate(timestamp: string) {
  return dateFormatter.format(new Date(timestamp))
}

export function LogsTable({ logs, onSelect }: LogsTableProps) {
  if (logs.length === 0) {
    return (
      <div className="grid min-h-72 place-items-center px-6 text-center">
        <div>
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-400">
            <span className="text-lg">∅</span>
          </div>
          <p className="mt-4 text-sm font-semibold text-slate-700">No encontramos logs</p>
          <p className="mt-1 text-xs text-slate-400">Modifica o elimina alguno de los filtros.</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="divide-y divide-slate-100 md:hidden">
        {logs.map((log) => (
          <article className="p-5" key={log.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-slate-800">{log.application}</p>
                <p className="mt-1 text-[10px] text-slate-400">{formatDate(log.timestamp)}</p>
              </div>
              <SeverityBadge severity={log.severity} />
            </div>
            <button
              className="mt-3 block w-full text-left text-xs leading-5 text-slate-600 transition hover:text-cyan-700"
              onClick={() => onSelect(log)}
              type="button"
            >
              {log.message}
            </button>
            <div className="mt-4 flex items-center justify-between gap-3 text-[10px] text-slate-400">
              <span className="truncate font-mono">{log.source}</span>
              <button
                className="shrink-0 font-semibold text-cyan-700"
                onClick={() => onSelect(log)}
                type="button"
              >
                Ver detalle
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[980px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              <th className="px-6 py-3.5">Fecha / hora</th>
              <th className="px-4 py-3.5">Aplicación</th>
              <th className="px-4 py-3.5">Severidad</th>
              <th className="px-4 py-3.5">Mensaje</th>
              <th className="px-4 py-3.5">Origen</th>
              <th className="px-6 py-3.5 text-right">Duración</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logs.map((log) => (
              <tr className="group transition-colors hover:bg-slate-50/70" key={log.id}>
                <td className="whitespace-nowrap px-6 py-4 text-[11px] font-medium text-slate-600">
                  {formatDate(log.timestamp)}
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-xs font-medium text-slate-700">
                  {log.application}
                </td>
                <td className="px-4 py-4">
                  <SeverityBadge severity={log.severity} />
                </td>
                <td className="max-w-md px-4 py-4">
                  <button
                    className="block w-full truncate text-left text-xs text-slate-600 transition hover:text-cyan-700"
                    onClick={() => onSelect(log)}
                    title={log.message}
                    type="button"
                  >
                    {log.message}
                  </button>
                  <p className="mt-1 truncate font-mono text-[9px] text-slate-400">{log.traceId}</p>
                </td>
                <td className="whitespace-nowrap px-4 py-4 font-mono text-[10px] text-slate-500">
                  {log.source}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-xs tabular-nums text-slate-500">
                  {log.durationMs.toLocaleString('es-MX')} ms
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
