import { NavLink } from 'react-router-dom'
import { Icon } from '../icons/Icon'
import { navigationItems } from './navigation'

type SidebarProps = {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      <button
        aria-label="Cerrar navegación"
        className={`fixed inset-0 z-30 bg-slate-950/60 backdrop-blur-sm transition-opacity lg:hidden ${
          isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        type="button"
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-white/5 bg-ink-900 text-slate-300 shadow-2xl transition-transform duration-300 lg:translate-x-0 lg:shadow-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-20 items-center justify-between px-6">
          <NavLink
            aria-label="Ir al dashboard"
            className="group flex items-center gap-3"
            onClick={onClose}
            to="/dashboard"
          >
            <span className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-xl bg-accent-400 text-ink-900 shadow-lg shadow-accent-500/20">
              <span className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-white/35" />
              <svg
                aria-hidden="true"
                className="relative h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.1"
              >
                <path d="M4 15h3l2-7 3 11 2-8 2 4h4" />
              </svg>
            </span>
            <span>
              <span className="block text-base font-semibold tracking-tight text-white">
                LogSentinel
              </span>
              <span className="block text-[10px] font-medium uppercase tracking-[0.22em] text-slate-500">
                Observability
              </span>
            </span>
          </NavLink>

          <button
            aria-label="Cerrar menú"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-white lg:hidden"
            onClick={onClose}
            type="button"
          >
            <Icon name="x" />
          </button>
        </div>

        <nav aria-label="Navegación principal" className="flex-1 px-4 py-5">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
            Monitoreo
          </p>
          <ul className="space-y-1.5">
            {navigationItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-accent-400/10 text-accent-300'
                        : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-100'
                    }`
                  }
                  onClick={onClose}
                  to={item.path}
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={`grid h-8 w-8 place-items-center rounded-lg transition-colors ${
                          isActive
                            ? 'bg-accent-400/10'
                            : 'bg-white/[0.03] group-hover:bg-white/[0.06]'
                        }`}
                      >
                        <Icon className="h-[18px] w-[18px]" name={item.icon} />
                      </span>
                      <span className="flex-1">{item.label}</span>
                      {isActive && (
                        <span className="h-1.5 w-1.5 rounded-full bg-accent-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="m-4 rounded-2xl border border-white/5 bg-white/[0.025] p-4">
          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Interfaz inicial
          </div>
          <p className="text-xs leading-relaxed text-slate-500">
            Sin fuentes de datos conectadas por el momento.
          </p>
        </div>
      </aside>
    </>
  )
}
