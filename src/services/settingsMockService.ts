import { initialSettingsMock } from '../data/settingsMock'
import type { LogSentinelSettings } from '../types/settings'

let sessionSettings = initialSettingsMock

export function getSessionSettings() {
  return sessionSettings
}

export function saveSessionSettings(settings: LogSentinelSettings) {
  sessionSettings = settings
}
