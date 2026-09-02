import type { ConnectionSettings } from '../../types/settings'
import { SettingsPanel } from './SettingsPanel'
import { SettingsToggle } from './SettingsToggle'

type ConnectionsSettingsPanelProps = {
  settings: ConnectionSettings
  onChange: (settings: ConnectionSettings) => void
}

export function ConnectionsSettingsPanel({
  settings,
  onChange,
}: ConnectionsSettingsPanelProps) {
  return (
    <SettingsPanel
      badge="Sin conexiones activas"
      description="Preferencias generales para futuras fuentes URL y SSH. La administración de conexiones pertenece a una tarea posterior."
      icon="apps"
      title="Conexiones"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <SettingsToggle
          checked={settings.urlConnectionsEnabled}
          description="Habilita visualmente la futura opción de registrar fuentes por URL."
          label="Permitir fuentes URL"
          onChange={(urlConnectionsEnabled) => onChange({ ...settings, urlConnectionsEnabled })}
        />
        <SettingsToggle
          checked={settings.sshConnectionsEnabled}
          description="Habilita visualmente la futura opción de conectar servidores por SSH."
          label="Permitir conexiones SSH"
          onChange={(sshConnectionsEnabled) => onChange({ ...settings, sshConnectionsEnabled })}
        />
        <SettingsToggle
          checked={settings.verifyHostIdentity}
          description="Representa la validación de identidad del host antes de conectar."
          label="Verificar identidad del host"
          onChange={(verifyHostIdentity) => onChange({ ...settings, verifyHostIdentity })}
        />
      </div>

      <label className="mt-6 block max-w-sm text-[10px] font-semibold uppercase tracking-wider text-slate-400">
        Tiempo de espera de conexión
        <select
          className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
          onChange={(event) => onChange({
            ...settings,
            connectionTimeoutSeconds: Number(event.target.value) as ConnectionSettings['connectionTimeoutSeconds'],
          })}
          value={settings.connectionTimeoutSeconds}
        >
          <option value={10}>10 segundos</option>
          <option value={30}>30 segundos</option>
          <option value={60}>60 segundos</option>
        </select>
      </label>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">URL</p>
          <p className="mt-2 text-xs font-semibold text-slate-700">No configurado</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">SSH</p>
          <p className="mt-2 text-xs font-semibold text-slate-700">No configurado</p>
        </div>
      </div>
    </SettingsPanel>
  )
}
