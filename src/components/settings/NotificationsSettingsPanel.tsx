import type { IntegrationStatus, NotificationSettings } from '../../types/settings'
import { SettingsPanel } from './SettingsPanel'

type NotificationsSettingsPanelProps = {
  settings: NotificationSettings
  onChange: (settings: NotificationSettings) => void
}

const inputClassName =
  'mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 disabled:bg-slate-50 disabled:text-slate-400'

function StatusBadge({ status }: { status: IntegrationStatus }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[8px] font-bold uppercase tracking-wider ring-1 ${
        status === 'DEMO'
          ? 'bg-cyan-50 text-cyan-700 ring-cyan-200'
          : 'bg-slate-100 text-slate-500 ring-slate-200'
      }`}
    >
      {status === 'DEMO' ? 'Configuración demo' : 'No configurado'}
    </span>
  )
}

export function NotificationsSettingsPanel({
  settings,
  onChange,
}: NotificationsSettingsPanelProps) {
  return (
    <SettingsPanel
      badge="Sin integraciones activas"
      description="Configura visualmente canales para alertas. Ningún mensaje o correo será enviado desde la maqueta."
      icon="alert"
      title="Notificaciones"
    >
      <div className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-semibold text-slate-800">Webhooks</h4>
              <p className="mt-1 text-[10px] text-slate-400">Slack, Teams u otro receptor HTTP.</p>
            </div>
            <StatusBadge status={settings.webhook.status} />
          </div>

          <div className="mt-5 space-y-4">
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Estado visual
              <select
                className={inputClassName}
                onChange={(event) => onChange({
                  ...settings,
                  webhook: {
                    ...settings.webhook,
                    status: event.target.value as IntegrationStatus,
                  },
                })}
                value={settings.webhook.status}
              >
                <option value="NOT_CONFIGURED">No configurado</option>
                <option value="DEMO">Configuración demo</option>
              </select>
            </label>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Nombre del canal
              <input
                className={inputClassName}
                disabled={settings.webhook.status === 'NOT_CONFIGURED'}
                maxLength={60}
                onChange={(event) => onChange({
                  ...settings,
                  webhook: { ...settings.webhook, name: event.target.value },
                })}
                placeholder="Ej. Alertas de operaciones"
                type="text"
                value={settings.webhook.name}
              />
            </label>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              URL de demostración
              <input
                className={inputClassName}
                disabled={settings.webhook.status === 'NOT_CONFIGURED'}
                onChange={(event) => onChange({
                  ...settings,
                  webhook: { ...settings.webhook, url: event.target.value },
                })}
                placeholder="https://ejemplo.invalid/webhook"
                type="url"
                value={settings.webhook.url}
              />
            </label>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-semibold text-slate-800">SMTP</h4>
              <p className="mt-1 text-[10px] text-slate-400">Parámetros no sensibles para correo saliente.</p>
            </div>
            <StatusBadge status={settings.smtp.status} />
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 sm:col-span-2">
              Estado visual
              <select
                className={inputClassName}
                onChange={(event) => onChange({
                  ...settings,
                  smtp: { ...settings.smtp, status: event.target.value as IntegrationStatus },
                })}
                value={settings.smtp.status}
              >
                <option value="NOT_CONFIGURED">No configurado</option>
                <option value="DEMO">Configuración demo</option>
              </select>
            </label>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Servidor SMTP
              <input
                className={inputClassName}
                disabled={settings.smtp.status === 'NOT_CONFIGURED'}
                onChange={(event) => onChange({
                  ...settings,
                  smtp: { ...settings.smtp, host: event.target.value },
                })}
                placeholder="smtp.demo.local"
                type="text"
                value={settings.smtp.host}
              />
            </label>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Puerto
              <input
                className={inputClassName}
                disabled={settings.smtp.status === 'NOT_CONFIGURED'}
                max={65535}
                min={1}
                onChange={(event) => onChange({
                  ...settings,
                  smtp: { ...settings.smtp, port: Number(event.target.value) },
                })}
                type="number"
                value={settings.smtp.port}
              />
            </label>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 sm:col-span-2">
              Remitente
              <input
                className={inputClassName}
                disabled={settings.smtp.status === 'NOT_CONFIGURED'}
                onChange={(event) => onChange({
                  ...settings,
                  smtp: { ...settings.smtp, sender: event.target.value },
                })}
                placeholder="alertas@empresa.com"
                type="email"
                value={settings.smtp.sender}
              />
            </label>
          </div>
        </article>
      </div>

      <p className="mt-5 rounded-xl border border-amber-200 bg-amber-50/60 px-4 py-3 text-[10px] leading-5 text-amber-800">
        No se solicitan contraseñas, tokens ni secretos. Guardar esta sección no realiza solicitudes HTTP.
      </p>
    </SettingsPanel>
  )
}
