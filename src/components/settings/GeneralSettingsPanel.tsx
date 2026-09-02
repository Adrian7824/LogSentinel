import type { GeneralSettings } from '../../types/settings'
import type { Severity } from '../../types/log'
import { SettingsPanel } from './SettingsPanel'

type GeneralSettingsPanelProps = {
  settings: GeneralSettings
  onChange: (settings: GeneralSettings) => void
}

const inputClassName =
  'mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100'

export function GeneralSettingsPanel({ settings, onChange }: GeneralSettingsPanelProps) {
  return (
    <SettingsPanel
      description="Preferencias generales utilizadas para representar el entorno y el formato de la información."
      icon="settings"
      title="Configuración general"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 sm:col-span-2">
          Nombre del entorno
          <input
            className={inputClassName}
            maxLength={80}
            onChange={(event) => onChange({ ...settings, environmentName: event.target.value })}
            placeholder="Ej. Producción"
            type="text"
            value={settings.environmentName}
          />
        </label>

        <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Zona horaria
          <select
            className={inputClassName}
            onChange={(event) => onChange({ ...settings, timezone: event.target.value })}
            value={settings.timezone}
          >
            <option value="America/Mexico_City">America/Mexico_City</option>
            <option value="America/Bogota">America/Bogota</option>
            <option value="America/New_York">America/New_York</option>
            <option value="Europe/Madrid">Europe/Madrid</option>
            <option value="UTC">UTC</option>
          </select>
        </label>

        <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Idioma
          <select
            className={inputClassName}
            onChange={(event) => onChange({
              ...settings,
              language: event.target.value as GeneralSettings['language'],
            })}
            value={settings.language}
          >
            <option value="es-MX">Español (México)</option>
            <option value="en-US">English (United States)</option>
          </select>
        </label>

        <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Formato de fecha
          <select
            className={inputClassName}
            onChange={(event) => onChange({
              ...settings,
              dateFormat: event.target.value as GeneralSettings['dateFormat'],
            })}
            value={settings.dateFormat}
          >
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </label>

        <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Nivel de log predeterminado
          <select
            className={inputClassName}
            onChange={(event) => onChange({
              ...settings,
              defaultLogLevel: event.target.value as Severity,
            })}
            value={settings.defaultLogLevel}
          >
            {(['INFO', 'WARNING', 'ERROR', 'CRITICAL'] as Severity[]).map((severity) => (
              <option key={severity} value={severity}>{severity}</option>
            ))}
          </select>
        </label>
      </div>
    </SettingsPanel>
  )
}
