import type { AlertStatus } from '../../types/alert'

type AlertToggleProps = {
  status: AlertStatus
  label: string
  onToggle: () => void
}

export function AlertToggle({ status, label, onToggle }: AlertToggleProps) {
  const isActive = status === 'ACTIVE'

  return (
    <button
      aria-checked={isActive}
      aria-label={`${isActive ? 'Desactivar' : 'Activar'} alerta ${label}`}
      className={`relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 ${
        isActive ? 'bg-emerald-500' : 'bg-slate-300'
      }`}
      onClick={onToggle}
      role="switch"
      type="button"
    >
      <span
        aria-hidden="true"
        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
          isActive ? 'translate-x-[18px]' : 'translate-x-0.5'
        }`}
      />
    </button>
  )
}
