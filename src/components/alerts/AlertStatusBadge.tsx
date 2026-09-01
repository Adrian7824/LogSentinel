import type { AlertStatus } from '../../types/alert'

type AlertStatusBadgeProps = {
  status: AlertStatus
}

const statusStyles: Record<AlertStatus, string> = {
  ACTIVE: 'bg-emerald-50 text-emerald-700',
  INACTIVE: 'bg-slate-100 text-slate-500',
}

export function AlertStatusBadge({ status }: AlertStatusBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusStyles[status]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
      {status === 'ACTIVE' ? 'Activa' : 'Inactiva'}
    </span>
  )
}
