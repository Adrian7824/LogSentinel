import { Link } from 'react-router-dom'
import { roleDefinitions } from '../../data/usersMock'
import type { SecuritySettings } from '../../types/settings'
import type { UserRole } from '../../types/user'
import { Icon } from '../icons/Icon'
import { SettingsPanel } from './SettingsPanel'
import { SettingsToggle } from './SettingsToggle'

type SecuritySettingsPanelProps = {
  settings: SecuritySettings
  onChange: (settings: SecuritySettings) => void
}

const selectClassName =
  'mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100'

export function SecuritySettingsPanel({ settings, onChange }: SecuritySettingsPanelProps) {
  return (
    <SettingsPanel
      badge="Seguridad simulada"
      description="Representación visual de sesiones, acceso, roles y auditoría. No aplica mecanismos reales de autenticación."
      icon="users"
      title="Seguridad"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Tiempo de sesión
          <select
            className={selectClassName}
            onChange={(event) => onChange({
              ...settings,
              sessionTimeoutMinutes: Number(event.target.value) as SecuritySettings['sessionTimeoutMinutes'],
            })}
            value={settings.sessionTimeoutMinutes}
          >
            <option value={15}>15 minutos</option>
            <option value={30}>30 minutos</option>
            <option value={60}>60 minutos</option>
            <option value={120}>120 minutos</option>
          </select>
        </label>

        <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Rol predeterminado
          <select
            className={selectClassName}
            onChange={(event) => onChange({
              ...settings,
              defaultRole: event.target.value as UserRole,
            })}
            value={settings.defaultRole}
          >
            {roleDefinitions.map((role) => (
              <option key={role.id} value={role.id}>{role.label}</option>
            ))}
          </select>
        </label>

        <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Retención de auditoría
          <select
            className={selectClassName}
            disabled={!settings.auditEnabled}
            onChange={(event) => onChange({
              ...settings,
              auditRetentionDays: Number(event.target.value) as SecuritySettings['auditRetentionDays'],
            })}
            value={settings.auditRetentionDays}
          >
            <option value={30}>30 días</option>
            <option value={60}>60 días</option>
            <option value={90}>90 días</option>
          </select>
        </label>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <SettingsToggle
          checked={settings.allowConcurrentSessions}
          description="Representa si una cuenta podría mantener más de una sesión."
          label="Sesiones simultáneas"
          onChange={(allowConcurrentSessions) => onChange({ ...settings, allowConcurrentSessions })}
        />
        <SettingsToggle
          checked={settings.auditEnabled}
          description="Simula el registro de cambios administrativos y accesos."
          label="Auditoría administrativa"
          onChange={(auditEnabled) => onChange({ ...settings, auditEnabled })}
        />
      </div>

      <Link
        className="mt-5 flex items-center justify-between rounded-xl border border-cyan-100 bg-cyan-50/50 px-4 py-3 text-xs font-semibold text-cyan-700 transition hover:bg-cyan-50"
        to="/usuarios"
      >
        Revisar usuarios, roles y políticas de acceso
        <Icon className="h-4 w-4" name="chevron" />
      </Link>

      <p className="mt-4 text-[10px] leading-5 text-slate-400">
        Estos controles no crean sesiones, no generan JWT y no protegen rutas del frontend.
      </p>
    </SettingsPanel>
  )
}
