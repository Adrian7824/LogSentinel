import { useEffect, type ReactNode } from 'react'
import { Icon } from '../icons/Icon'

type DetailDrawerProps = {
  title: string
  headerContent?: ReactNode
  children: ReactNode
  onClose: () => void
}

export function DetailDrawer({ title, headerContent, children, onClose }: DetailDrawerProps) {
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50">
      <button
        aria-label="Cerrar detalle"
        className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm"
        onClick={onClose}
        type="button"
      />
      <aside
        aria-labelledby="detail-drawer-title"
        aria-modal="true"
        className="absolute inset-y-0 right-0 flex w-full max-w-2xl flex-col bg-white shadow-2xl"
        role="dialog"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-5 sm:px-7">
          <div className="min-w-0">
            {headerContent}
            <h2 className="text-lg font-semibold text-slate-900" id="detail-drawer-title">
              {title}
            </h2>
          </div>
          <button
            aria-label="Cerrar"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            onClick={onClose}
            type="button"
          >
            <Icon name="x" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-7">{children}</div>
      </aside>
    </div>
  )
}
