import type { Severity } from '../../types/log'

type SeverityBadgeProps = {
  severity: Severity
}

const severityStyles: Record<Severity, string> = {
  INFO: 'bg-sky-50 text-sky-700 ring-sky-600/10',
  WARNING: 'bg-amber-50 text-amber-700 ring-amber-600/10',
  ERROR: 'bg-rose-50 text-rose-700 ring-rose-600/10',
  CRITICAL: 'bg-violet-50 text-violet-700 ring-violet-600/10',
}

export function SeverityBadge({ severity }: SeverityBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-md px-2 py-1 text-[10px] font-semibold ring-1 ring-inset ${severityStyles[severity]}`}
    >
      {severity}
    </span>
  )
}
