import type { ReactNode } from 'react'

type DashboardPanelProps = {
  title: string
  description: string
  action?: ReactNode
  children: ReactNode
  className?: string
}

export function DashboardPanel({
  title,
  description,
  action,
  children,
  className = '',
}: DashboardPanelProps) {
  return (
    <section
      className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-panel ${className}`}
    >
      <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          <p className="mt-1 text-xs text-slate-500">{description}</p>
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}
