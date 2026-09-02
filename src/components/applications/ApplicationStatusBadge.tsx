import type { ApplicationStatus } from '../../types/application'

type ApplicationStatusBadgeProps = {
  status: ApplicationStatus
}

const statusConfig: Record<ApplicationStatus, { label: string; style: string; dot: string }> = {
  HEALTHY: {
    label: 'Saludable',
    style: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    dot: 'bg-emerald-500',
  },
  DEGRADED: {
    label: 'Degradada',
    style: 'border-amber-200 bg-amber-50 text-amber-700',
    dot: 'bg-amber-500',
  },
  CRITICAL: {
    label: 'Crítica',
    style: 'border-rose-200 bg-rose-50 text-rose-700',
    dot: 'bg-rose-500',
  },
  PAUSED: {
    label: 'Pausada',
    style: 'border-slate-200 bg-slate-100 text-slate-600',
    dot: 'bg-slate-400',
  },
}

export function ApplicationStatusBadge({ status }: ApplicationStatusBadgeProps) {
  const config = statusConfig[status]
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${config.style}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  )
}
