import { Link } from 'react-router-dom'
import type { EventStatus, RecentEvent } from '../../types/dashboard'
import { SeverityBadge } from '../ui/SeverityBadge'

type RecentEventsTableProps = {
  events: RecentEvent[]
}

const statusStyles: Record<EventStatus, string> = {
  Nuevo: 'bg-slate-100 text-slate-700',
  Investigando: 'bg-rose-50 text-rose-700',
  Monitoreando: 'bg-amber-50 text-amber-700',
  Resuelto: 'bg-emerald-50 text-emerald-700',
}

function StatusBadge({ status }: { status: EventStatus }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium ${statusStyles[status]}`}>
      {status}
    </span>
  )
}

export function RecentEventsTable({ events }: RecentEventsTableProps) {
  if (events.length === 0) {
    return (
      <div className="grid min-h-56 place-items-center px-6 text-center">
        <div>
          <p className="text-sm font-medium text-slate-700">No hay eventos para mostrar</p>
          <p className="mt-1 text-xs text-slate-400">Prueba con otra aplicación.</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="divide-y divide-slate-100 md:hidden">
        {events.map((event) => (
          <article className="p-5" key={event.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-slate-800">{event.application}</p>
                <p className="mt-1 text-[10px] text-slate-400">
                  {event.date} · {event.time}
                </p>
              </div>
              <SeverityBadge severity={event.severity} />
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-600">{event.message}</p>
            <div className="mt-4 flex items-center justify-between gap-3">
              <span className="text-[10px] text-slate-400">{event.user}</span>
              <StatusBadge status={event.status} />
            </div>
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[880px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              <th className="px-6 py-3.5">Fecha / hora</th>
              <th className="px-4 py-3.5">Aplicación</th>
              <th className="px-4 py-3.5">Severidad</th>
              <th className="px-4 py-3.5">Mensaje</th>
              <th className="px-4 py-3.5">Usuario</th>
              <th className="px-6 py-3.5 text-right">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {events.map((event) => (
              <tr className="group transition-colors hover:bg-slate-50/70" key={event.id}>
                <td className="whitespace-nowrap px-6 py-4">
                  <p className="text-xs font-medium text-slate-700">{event.time}</p>
                  <p className="mt-0.5 text-[10px] text-slate-400">{event.date}</p>
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-xs font-medium text-slate-700">
                  {event.application}
                </td>
                <td className="px-4 py-4">
                  <SeverityBadge severity={event.severity} />
                </td>
                <td className="max-w-sm px-4 py-4">
                  <Link
                    className="block truncate text-xs text-slate-600 transition hover:text-cyan-700"
                    to="/logs"
                  >
                    {event.message}
                  </Link>
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-xs text-slate-500">
                  {event.user}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right">
                  <StatusBadge status={event.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
