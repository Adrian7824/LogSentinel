import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { DashboardPanel } from '../components/dashboard/DashboardPanel'
import { LogsChart } from '../components/dashboard/LogsChart'
import { MetricCard } from '../components/dashboard/MetricCard'
import { RecentEventsTable } from '../components/dashboard/RecentEventsTable'
import { SeverityChart } from '../components/dashboard/SeverityChart'
import { Icon } from '../components/icons/Icon'
import {
  dashboardMetrics,
  logSeriesByRange,
  monitoredApplications,
  recentEvents,
  severityDistribution,
} from '../data/dashboardMock'
import type { TimeRange } from '../types/dashboard'

const timeRangeOptions: { value: TimeRange; label: string }[] = [
  { value: '24h', label: '24 horas' },
  { value: '7d', label: '7 días' },
  { value: '30d', label: '30 días' },
]

export function DashboardPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('24h')
  const [application, setApplication] = useState('Todas las aplicaciones')
  const filteredEvents = useMemo(
    () =>
      application === 'Todas las aplicaciones'
        ? recentEvents
        : recentEvents.filter((event) => event.application === application),
    [application],
  )

  return (
    <section aria-labelledby="dashboard-title" className="mx-auto max-w-[1500px]">
      <div className="mb-6 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400">
            <span>LogSentinel</span>
            <Icon className="h-3.5 w-3.5" name="chevron" />
            <span className="text-slate-600">Dashboard</span>
          </div>
          <h2
            className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl"
            id="dashboard-title"
          >
            Estado del sistema
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Monitorea el volumen de eventos y detecta rápidamente cualquier anomalía.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative">
            <span className="sr-only">Filtrar por aplicación</span>
            <select
              className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white py-0 pl-3 pr-9 text-xs font-medium text-slate-700 shadow-sm outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 sm:w-52"
              onChange={(event) => setApplication(event.target.value)}
              value={application}
            >
              {monitoredApplications.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <Icon className="pointer-events-none absolute right-3 top-3 h-4 w-4 rotate-90 text-slate-400" name="chevron" />
          </label>

          <div
            aria-label="Rango temporal"
            className="flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm"
            role="group"
          >
            {timeRangeOptions.map((option) => (
              <button
                aria-pressed={timeRange === option.value}
                className={`flex-1 rounded-lg px-3 py-1.5 text-[11px] font-semibold transition sm:flex-none ${
                  timeRange === option.value
                    ? 'bg-ink-800 text-white shadow-sm'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
                key={option.value}
                onClick={() => setTimeRange(option.value)}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {dashboardMetrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
        <DashboardPanel
          action={
            <div className="flex items-center gap-2 text-[11px] font-medium text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Datos mock actualizados
            </div>
          }
          description={`Volumen agregado durante las últimas ${timeRangeOptions.find((option) => option.value === timeRange)?.label.toLowerCase()}.`}
          title="Logs por tiempo"
        >
          <LogsChart data={logSeriesByRange[timeRange]} />
        </DashboardPanel>

        <DashboardPanel
          description="Proporción de eventos según su nivel."
          title="Distribución de severidad"
        >
          <SeverityChart data={severityDistribution} />
        </DashboardPanel>
      </div>

      <DashboardPanel
        action={
          <Link
            className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-700 transition hover:text-cyan-800"
            to="/logs"
          >
            Ver todos los logs
            <Icon className="h-3.5 w-3.5" name="chevron" />
          </Link>
        }
        className="mt-5"
        description={`${filteredEvents.length} eventos recientes${application === 'Todas las aplicaciones' ? '' : ` en ${application}`}.`}
        title="Eventos recientes"
      >
        <RecentEventsTable events={filteredEvents} />
      </DashboardPanel>
    </section>
  )
}
