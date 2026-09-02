import type { UserStatus } from '../../types/user'

type UserStatusBadgeProps = {
  status: UserStatus
}

const statusConfig: Record<UserStatus, { label: string; style: string }> = {
  ACTIVE: {
    label: 'Activo',
    style: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  },
  INACTIVE: {
    label: 'Inactivo',
    style: 'border-slate-200 bg-slate-100 text-slate-600',
  },
  SUSPENDED: {
    label: 'Suspendido',
    style: 'border-rose-200 bg-rose-50 text-rose-700',
  },
}

export function UserStatusBadge({ status }: UserStatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${config.style}`}
    >
      {config.label}
    </span>
  )
}
