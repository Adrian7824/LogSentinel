import type { RetentionPeriod, RetentionSettings } from '../../types/settings'
import { SettingsPanel } from './SettingsPanel'
import { SettingsToggle } from './SettingsToggle'

type RetentionSettingsPanelProps = {
  settings: RetentionSettings
  onChange: (settings: RetentionSettings) => void
}

const periods: Array<{ value: RetentionPeriod; label: string; description: string }> = [
  { value: 7, label: '7 días', description: 'Entornos de prueba' },
  { value: 30, label: '30 días', description: 'Retención estándar' },
  { value: 90, label: '90 días', description: 'Historial ampliado' },
  { value: 'CUSTOM', label: 'Personalizado', description: 'Define el periodo' },
]

export function RetentionSettingsPanel({ settings, onChange }: RetentionSettingsPanelProps) {
  return (
    <SettingsPanel
      description="Representa cuánto tiempo se conservarían los logs antes de archivarlos o depurarlos. No elimina información real."
      icon="logs"
      title="Retención de datos"
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {periods.map((period) => {
          const isSelected = settings.period === period.value
          return (
            <button
              aria-pressed={isSelected}
              className={`rounded-xl border p-4 text-left transition ${
                isSelected
                  ? 'border-cyan-300 bg-cyan-50/60 ring-2 ring-cyan-100'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
              key={period.value}
              onClick={() => onChange({ ...settings, period: period.value })}
              type="button"
            >
              <span className="block text-xs font-semibold text-slate-700">{period.label}</span>
              <span className="mt-1 block text-[10px] text-slate-400">{period.description}</span>
            </button>
          )
        })}
      </div>

      {settings.period === 'CUSTOM' && (
        <label className="mt-5 block max-w-xs text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Días de retención
          <input
            className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
            max={365}
            min={1}
            onChange={(event) => onChange({
              ...settings,
              customDays: Math.min(365, Math.max(1, Number(event.target.value))),
            })}
            type="number"
            value={settings.customDays}
          />
        </label>
      )}

      <div className="mt-6 max-w-xl">
        <SettingsToggle
          checked={settings.archiveBeforeDelete}
          description="Simula el archivado previo a la depuración automática."
          label="Archivar antes de depurar"
          onChange={(archiveBeforeDelete) => onChange({ ...settings, archiveBeforeDelete })}
        />
      </div>

      <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50/60 px-4 py-3 text-[10px] leading-5 text-amber-800">
        Esta opción es demostrativa. Ningún log será archivado o eliminado desde el frontend.
      </div>
    </SettingsPanel>
  )
}
