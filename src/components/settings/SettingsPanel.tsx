import type { ReactNode } from 'react'
import type { IconName } from '../icons/Icon'
import { Icon } from '../icons/Icon'

type SettingsPanelProps = {
  title: string
  description: string
  icon: IconName
  badge?: string
  children: ReactNode
}

export function SettingsPanel({
  title,
  description,
  icon,
  badge = 'Configuración demo',
  children,
}: SettingsPanelProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-panel">
      <header className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-cyan-50 text-cyan-700 ring-1 ring-cyan-100">
            <Icon className="h-5 w-5" name={icon} />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
            <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">{description}</p>
          </div>
        </div>
        <span className="w-fit rounded-full bg-amber-50 px-2.5 py-1 text-[8px] font-bold uppercase tracking-wider text-amber-700 ring-1 ring-amber-200">
          {badge}
        </span>
      </header>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  )
}
