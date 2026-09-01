import { useLocation } from 'react-router-dom'
import { Icon } from '../icons/Icon'
import { navigationItems } from './navigation'

type HeaderProps = {
  onMenuOpen: () => void
}

export function Header({ onMenuOpen }: HeaderProps) {
  const { pathname } = useLocation()
  const currentPage = navigationItems.find((item) => item.path === pathname)

  return (
    <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200/80 bg-slate-50/85 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          aria-label="Abrir menú"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-900 lg:hidden"
          onClick={onMenuOpen}
          type="button"
        >
          <Icon name="menu" />
        </button>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Workspace
          </p>
          <h1 className="truncate text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
            {currentPage?.label ?? 'Dashboard'}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Entorno local
        </div>
        <button
          aria-label="Abrir perfil de usuario"
          className="flex items-center gap-2.5 rounded-xl p-1.5 pr-2 transition hover:bg-slate-100"
          type="button"
        >
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-ink-800 text-xs font-semibold text-white">
            LS
          </span>
          <span className="hidden text-left md:block">
            <span className="block text-xs font-semibold text-slate-800">Administrador</span>
            <span className="block text-[10px] text-slate-400">Equipo técnico</span>
          </span>
          <Icon className="hidden h-4 w-4 rotate-90 text-slate-400 md:block" name="chevron" />
        </button>
      </div>
    </header>
  )
}
