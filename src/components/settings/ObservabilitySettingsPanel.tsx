import type { Severity } from '../../types/log'
import type { ObservabilitySettings } from '../../types/settings'
import { SettingsPanel } from './SettingsPanel'
import { SettingsToggle } from './SettingsToggle'

type ObservabilitySettingsPanelProps = {
  settings: ObservabilitySettings
  onChange: (settings: ObservabilitySettings) => void
}

const severities: Severity[] = ['INFO', 'WARNING', 'ERROR', 'CRITICAL']

const severityStyles: Record<Severity, string> = {
  INFO: 'border-cyan-200 bg-cyan-50 text-cyan-700',
  WARNING: 'border-amber-200 bg-amber-50 text-amber-700',
  ERROR: 'border-orange-200 bg-orange-50 text-orange-700',
  CRITICAL: 'border-rose-200 bg-rose-50 text-rose-700',
}

const selectClassName =
  'mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100'

export function ObservabilitySettingsPanel({
  settings,
  onChange,
}: ObservabilitySettingsPanelProps) {
  const toggleSeverity = (severity: Severity) => {
    const isVisible = settings.visibleSeverities.includes(severity)
    if (isVisible && settings.visibleSeverities.length === 1) return
    onChange({
      ...settings,
      visibleSeverities: isVisible
        ? settings.visibleSeverities.filter((item) => item !== severity)
        : [...settings.visibleSeverities, severity],
    })
  }

  return (
    <SettingsPanel
      description="Controla qué eventos muestra la interfaz y cómo se actualizan las vistas operativas."
      icon="dashboard"
      title="Observabilidad"
    >
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Severidades visibles</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {severities.map((severity) => {
            const isVisible = settings.visibleSeverities.includes(severity)
            return (
              <button
                aria-pressed={isVisible}
                className={`rounded-lg border px-3 py-2 text-[10px] font-bold transition ${
                  isVisible ? severityStyles[severity] : 'border-slate-200 bg-white text-slate-400'
                }`}
                key={severity}
                onClick={() => toggleSeverity(severity)}
                type="button"
              >
                {severity}
              </button>
            )
          })}
        </div>
        <p className="mt-2 text-[9px] text-slate-400">Debe permanecer al menos una severidad visible.</p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <SettingsToggle
          checked={settings.autoRefresh}
          description="Simula la actualización periódica de dashboard y logs."
          label="Actualización automática"
          onChange={(autoRefresh) => onChange({ ...settings, autoRefresh })}
        />
        <SettingsToggle
          checked={settings.showResolvedIncidents}
          description="Incluye incidentes resueltos en los resúmenes del dashboard."
          label="Mostrar incidentes resueltos"
          onChange={(showResolvedIncidents) => onChange({ ...settings, showResolvedIncidents })}
        />
        <SettingsToggle
          checked={settings.compactDashboard}
          description="Reduce visualmente el espacio de tarjetas y tablas."
          label="Dashboard compacto"
          onChange={(compactDashboard) => onChange({ ...settings, compactDashboard })}
        />
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Intervalo de actualización
          <select
            className={selectClassName}
            disabled={!settings.autoRefresh}
            onChange={(event) => onChange({
              ...settings,
              refreshIntervalSeconds: Number(event.target.value) as ObservabilitySettings['refreshIntervalSeconds'],
            })}
            value={settings.refreshIntervalSeconds}
          >
            <option value={5}>5 segundos</option>
            <option value={15}>15 segundos</option>
            <option value={30}>30 segundos</option>
            <option value={60}>60 segundos</option>
          </select>
        </label>
        <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Eventos mostrados
          <select
            className={selectClassName}
            onChange={(event) => onChange({
              ...settings,
              eventLimit: Number(event.target.value) as ObservabilitySettings['eventLimit'],
            })}
            value={settings.eventLimit}
          >
            <option value={50}>50 eventos</option>
            <option value={100}>100 eventos</option>
            <option value={250}>250 eventos</option>
            <option value={500}>500 eventos</option>
          </select>
        </label>
      </div>
    </SettingsPanel>
  )
}
