import { useMemo, useState } from 'react'
import { ConnectionsSettingsPanel } from '../components/settings/ConnectionsSettingsPanel'
import { GeneralSettingsPanel } from '../components/settings/GeneralSettingsPanel'
import { NotificationsSettingsPanel } from '../components/settings/NotificationsSettingsPanel'
import { ObservabilitySettingsPanel } from '../components/settings/ObservabilitySettingsPanel'
import { RetentionSettingsPanel } from '../components/settings/RetentionSettingsPanel'
import { SecuritySettingsPanel } from '../components/settings/SecuritySettingsPanel'
import { Icon, type IconName } from '../components/icons/Icon'
import { getSessionSettings, saveSessionSettings } from '../services/settingsMockService'
import type { LogSentinelSettings, SettingsSectionId } from '../types/settings'

const sections: Array<{
  id: SettingsSectionId
  label: string
  description: string
  icon: IconName
}> = [
  { id: 'general', label: 'General', description: 'Entorno y formato', icon: 'settings' },
  { id: 'observability', label: 'Observabilidad', description: 'Vistas y actualización', icon: 'dashboard' },
  { id: 'retention', label: 'Retención', description: 'Ciclo de vida de logs', icon: 'logs' },
  { id: 'notifications', label: 'Notificaciones', description: 'Webhook y SMTP', icon: 'alert' },
  { id: 'security', label: 'Seguridad', description: 'Sesiones y auditoría', icon: 'users' },
  { id: 'connections', label: 'Conexiones', description: 'Preferencias de fuentes', icon: 'apps' },
]

export function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSectionId>('general')
  const [settings, setSettings] = useState<LogSentinelSettings>(getSessionSettings)
  const [savedSettings, setSavedSettings] = useState<LogSentinelSettings>(getSessionSettings)
  const [showSavedFeedback, setShowSavedFeedback] = useState(false)

  const hasChanges = useMemo(
    () => JSON.stringify(settings) !== JSON.stringify(savedSettings),
    [savedSettings, settings],
  )

  const updateSettings = (nextSettings: LogSentinelSettings) => {
    setSettings(nextSettings)
    setShowSavedFeedback(false)
  }

  const saveSettings = () => {
    saveSessionSettings(settings)
    setSavedSettings(settings)
    setShowSavedFeedback(true)
  }

  const resetChanges = () => {
    setSettings(savedSettings)
    setShowSavedFeedback(false)
  }

  const activePanel = (() => {
    switch (activeSection) {
      case 'general':
        return (
          <GeneralSettingsPanel
            onChange={(general) => updateSettings({ ...settings, general })}
            settings={settings.general}
          />
        )
      case 'observability':
        return (
          <ObservabilitySettingsPanel
            onChange={(observability) => updateSettings({ ...settings, observability })}
            settings={settings.observability}
          />
        )
      case 'retention':
        return (
          <RetentionSettingsPanel
            onChange={(retention) => updateSettings({ ...settings, retention })}
            settings={settings.retention}
          />
        )
      case 'notifications':
        return (
          <NotificationsSettingsPanel
            onChange={(notifications) => updateSettings({ ...settings, notifications })}
            settings={settings.notifications}
          />
        )
      case 'security':
        return (
          <SecuritySettingsPanel
            onChange={(security) => updateSettings({ ...settings, security })}
            settings={settings.security}
          />
        )
      case 'connections':
        return (
          <ConnectionsSettingsPanel
            onChange={(connections) => updateSettings({ ...settings, connections })}
            settings={settings.connections}
          />
        )
    }
  })()

  return (
    <section aria-labelledby="settings-title" className="mx-auto max-w-[1500px]">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400">
            <span>LogSentinel</span>
            <Icon className="h-3.5 w-3.5" name="chevron" />
            <span className="text-slate-600">Configuración</span>
          </div>
          <h2
            className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl"
            id="settings-title"
          >
            Configuración de LogSentinel
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Personaliza el comportamiento esperado de la plataforma durante esta demostración.
          </p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[10px] font-semibold text-amber-700">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          Estado local · Sin backend
        </span>
      </div>

      <div className="mb-5 flex items-start gap-3 rounded-2xl border border-cyan-200 bg-cyan-50/60 px-4 py-3 text-cyan-900 sm:px-5">
        <Icon className="mt-0.5 h-4 w-4 shrink-0" name="settings" />
        <p className="text-[11px] leading-5">
          Todos los controles son demostrativos. Guardar conserva los cambios en memoria mientras navegas, pero no realiza solicitudes HTTP y la configuración se reinicia al recargar.
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[250px_minmax(0,1fr)]">
        <nav aria-label="Secciones de configuración" className="min-w-0">
          <div className="flex gap-2 overflow-x-auto pb-2 xl:sticky xl:top-24 xl:block xl:space-y-2 xl:overflow-visible xl:rounded-2xl xl:border xl:border-slate-200 xl:bg-white xl:p-3 xl:shadow-panel">
            {sections.map((section) => {
              const isActive = activeSection === section.id
              return (
                <button
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex min-w-[175px] items-center gap-3 rounded-xl px-3 py-3 text-left transition xl:w-full ${
                    isActive
                      ? 'bg-ink-800 text-white shadow-sm'
                      : 'border border-slate-200 bg-white text-slate-600 hover:border-cyan-200 hover:text-cyan-700 xl:border-transparent'
                  }`}
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  type="button"
                >
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-cyan-300' : 'text-slate-400'}`} name={section.icon} />
                  <span>
                    <span className="block text-xs font-semibold">{section.label}</span>
                    <span className={`mt-0.5 block text-[9px] ${isActive ? 'text-slate-400' : 'text-slate-400'}`}>
                      {section.description}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </nav>

        <div className="min-w-0">
          {activePanel}

          <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-panel sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div aria-live="polite" className="min-h-5">
              {showSavedFeedback ? (
                <p className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-100">✓</span>
                  Configuración actualizada para esta sesión
                </p>
              ) : (
                <p className="text-[10px] text-slate-400">
                  {hasChanges ? 'Hay cambios locales sin guardar.' : 'No hay cambios pendientes.'}
                </p>
              )}
            </div>
            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <button
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                disabled={!hasChanges}
                onClick={resetChanges}
                type="button"
              >
                Descartar cambios
              </button>
              <button
                className="rounded-xl bg-ink-800 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-ink-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                disabled={!hasChanges}
                onClick={saveSettings}
                type="button"
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
