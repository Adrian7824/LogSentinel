import { Icon } from '../icons/Icon'
import type { DashboardMetric, MetricAccent } from '../../types/dashboard'

type MetricCardProps = {
  metric: DashboardMetric
}

const accentStyles: Record<
  MetricAccent,
  { icon: string; decoration: string }
> = {
  cyan: {
    icon: 'bg-cyan-50 text-cyan-600 ring-cyan-100',
    decoration: 'bg-cyan-400',
  },
  rose: {
    icon: 'bg-rose-50 text-rose-600 ring-rose-100',
    decoration: 'bg-rose-400',
  },
  indigo: {
    icon: 'bg-indigo-50 text-indigo-600 ring-indigo-100',
    decoration: 'bg-indigo-400',
  },
  emerald: {
    icon: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
    decoration: 'bg-emerald-400',
  },
  amber: {
    icon: 'bg-amber-50 text-amber-600 ring-amber-100',
    decoration: 'bg-amber-400',
  },
}

const trendStyles = {
  positive: 'bg-emerald-50 text-emerald-700',
  negative: 'bg-rose-50 text-rose-700',
  neutral: 'bg-slate-100 text-slate-600',
}

export function MetricCard({ metric }: MetricCardProps) {
  const accent = accentStyles[metric.accent]

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-panel transition duration-200 hover:-translate-y-0.5 hover:border-slate-300">
      <span
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 h-0.5 opacity-0 transition-opacity group-hover:opacity-100 ${accent.decoration}`}
      />
      <div className="flex items-start justify-between gap-3">
        <div className={`grid h-10 w-10 place-items-center rounded-xl ring-1 ${accent.icon}`}>
          <Icon className="h-5 w-5" name={metric.icon} />
        </div>
        <span
          className={`rounded-full px-2 py-1 text-[10px] font-semibold ${trendStyles[metric.trendTone]}`}
        >
          {metric.trendDirection === 'up' && '↑ '}
          {metric.trendDirection === 'down' && '↓ '}
          {metric.trend}
        </span>
      </div>
      <p className="mt-5 text-2xl font-semibold tracking-tight text-slate-950">
        {metric.value}
      </p>
      <p className="mt-1 text-xs font-medium text-slate-600">{metric.label}</p>
      <p className="mt-2 truncate text-[11px] text-slate-400">{metric.helper}</p>
    </article>
  )
}
