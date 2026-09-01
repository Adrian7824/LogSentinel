import type { Severity, SeverityData } from '../../types/dashboard'

type SeverityChartProps = {
  data: SeverityData[]
}

const severityStyles: Record<
  Severity,
  { color: string; dot: string; label: string }
> = {
  INFO: { color: '#38bdf8', dot: 'bg-sky-400', label: 'Información' },
  WARNING: { color: '#fbbf24', dot: 'bg-amber-400', label: 'Advertencia' },
  ERROR: { color: '#fb7185', dot: 'bg-rose-400', label: 'Error' },
  CRITICAL: { color: '#a78bfa', dot: 'bg-violet-400', label: 'Crítico' },
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('es-MX', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

export function SeverityChart({ data }: SeverityChartProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0)
  let accumulatedPercentage = 0
  const segments = data.map((item) => {
    const start = accumulatedPercentage
    const percentage = (item.count / total) * 100
    accumulatedPercentage += percentage
    return `${severityStyles[item.severity].color} ${start}% ${accumulatedPercentage}%`
  })

  return (
    <div className="flex flex-col items-center gap-7 px-6 py-7 sm:flex-row xl:flex-col">
      <div
        aria-label="Gráfico de distribución por severidad"
        className="relative grid h-44 w-44 shrink-0 place-items-center rounded-full"
        role="img"
        style={{ background: `conic-gradient(${segments.join(', ')})` }}
      >
        <div className="grid h-28 w-28 place-items-center rounded-full bg-white shadow-inner">
          <div className="text-center">
            <p className="text-2xl font-semibold tracking-tight text-slate-950">
              {formatNumber(total)}
            </p>
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
              Eventos
            </p>
          </div>
        </div>
      </div>

      <ul className="grid w-full grid-cols-2 gap-x-5 gap-y-4 sm:max-w-sm xl:grid-cols-1">
        {data.map((item) => {
          const percentage = ((item.count / total) * 100).toFixed(1)
          const styles = severityStyles[item.severity]

          return (
            <li className="flex items-center justify-between gap-3" key={item.severity}>
              <span className="flex min-w-0 items-center gap-2 text-xs text-slate-600">
                <span className={`h-2 w-2 shrink-0 rounded-full ${styles.dot}`} />
                <span className="truncate">{styles.label}</span>
              </span>
              <span className="text-xs font-semibold tabular-nums text-slate-800">
                {percentage}%
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
