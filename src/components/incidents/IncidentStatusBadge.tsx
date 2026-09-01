import type { IncidentStatus } from '../../types/incident'

type IncidentStatusBadgeProps = {
  status: IncidentStatus
}

const statusConfig: Record<IncidentStatus, { label: string; style: string; dot: string }> = {
  OPEN: {
    label: 'Abierto',
    style: 'bg-rose-50 text-rose-700',
    dot: 'bg-rose-500',
  },
  INVESTIGATING: {
    label: 'Investigando',
    style: 'bg-amber-50 text-amber-700',
    dot: 'bg-amber-500',
  },
  RESOLVED: {
    label: 'Resuelto',
    style: 'bg-emerald-50 text-emerald-700',
    dot: 'bg-emerald-500',
  },
}

export function IncidentStatusBadge({ status }: IncidentStatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${config.style}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  )
}
