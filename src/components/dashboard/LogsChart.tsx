import type { LogDataPoint } from '../../types/dashboard'

type LogsChartProps = {
  data: LogDataPoint[]
}

const chart = {
  width: 680,
  height: 250,
  top: 18,
  right: 18,
  bottom: 38,
  left: 48,
}

function formatCompact(value: number) {
  return new Intl.NumberFormat('es-MX', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

export function LogsChart({ data }: LogsChartProps) {
  const plotWidth = chart.width - chart.left - chart.right
  const plotHeight = chart.height - chart.top - chart.bottom
  const maxValue = Math.max(...data.map((point) => point.value)) * 1.12
  const baseline = chart.top + plotHeight
  const xStep = data.length > 1 ? plotWidth / (data.length - 1) : 0
  const points = data.map((point, index) => ({
    ...point,
    x: chart.left + index * xStep,
    y: chart.top + plotHeight - (point.value / maxValue) * plotHeight,
  }))
  const linePath = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ')
  const lastPoint = points[points.length - 1]
  const areaPath = `${linePath} L ${lastPoint?.x ?? chart.left} ${baseline} L ${points[0]?.x ?? chart.left} ${baseline} Z`
  const labelStep = Math.max(1, Math.ceil(data.length / 6))
  const gridLines = [0, 0.25, 0.5, 0.75, 1]

  return (
    <div className="px-3 pb-4 pt-5 sm:px-5">
      <svg
        aria-label="Volumen de logs procesados a lo largo del tiempo"
        className="h-auto min-h-[230px] w-full"
        role="img"
        viewBox={`0 0 ${chart.width} ${chart.height}`}
      >
        <title>Logs procesados por tiempo</title>
        <defs>
          <linearGradient id="logsArea" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.26" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
          </linearGradient>
          <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur result="blur" stdDeviation="3" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {gridLines.map((position) => {
          const y = chart.top + plotHeight * position
          return (
            <g key={position}>
              <line
                stroke="#e2e8f0"
                strokeDasharray="3 5"
                strokeWidth="1"
                x1={chart.left}
                x2={chart.width - chart.right}
                y1={y}
                y2={y}
              />
              <text
                fill="#94a3b8"
                fontSize="10"
                textAnchor="end"
                x={chart.left - 10}
                y={y + 3}
              >
                {formatCompact(maxValue * (1 - position))}
              </text>
            </g>
          )
        })}

        <path d={areaPath} fill="url(#logsArea)" />
        <path
          d={linePath}
          fill="none"
          filter="url(#lineGlow)"
          stroke="#06b6d4"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
        />

        {points.map((point, index) => (
          <g key={`${point.label}-${point.value}`}>
            <circle cx={point.x} cy={point.y} fill="#ffffff" r="4" stroke="#06b6d4" strokeWidth="2" />
            {(index % labelStep === 0 || index === points.length - 1) && (
              <text
                fill="#94a3b8"
                fontSize="10"
                textAnchor="middle"
                x={point.x}
                y={chart.height - 11}
              >
                {point.label}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  )
}
