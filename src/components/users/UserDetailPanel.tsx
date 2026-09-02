import {
  permissionActions,
  roleDefinitions,
  userModules,
  weekdays,
} from '../../data/usersMock'
import type { UserAccount } from '../../types/user'
import { Icon } from '../icons/Icon'
import { DetailDrawer } from '../ui/DetailDrawer'
import { UserStatusBadge } from './UserStatusBadge'

type UserDetailPanelProps = {
  user: UserAccount | null
  onClose: () => void
  onEdit: (user: UserAccount) => void
  onToggleStatus: (userId: string) => void
}

const fullDateFormatter = new Intl.DateTimeFormat('es-MX', {
  dateStyle: 'long',
  timeStyle: 'short',
})

function getRoleLabel(user: UserAccount) {
  return roleDefinitions.find((role) => role.id === user.role)?.label ?? user.role
}

export function UserDetailPanel({
  user,
  onClose,
  onEdit,
  onToggleStatus,
}: UserDetailPanelProps) {
  if (!user) return null

  const allowedDayLabels = weekdays
    .filter((day) => user.accessPolicy.allowedDays.includes(day.id))
    .map((day) => day.label)

  return (
    <DetailDrawer
      headerContent={
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <UserStatusBadge status={user.status} />
          <span className="font-mono text-[10px] text-slate-400">{user.id}</span>
        </div>
      }
      onClose={onClose}
      title="Detalle del usuario"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900">{user.name}</h3>
          <p className="mt-1 text-xs text-slate-500">{user.email}</p>
        </div>
        <div className="flex gap-2">
          <button
            className="rounded-xl border border-slate-200 px-3 py-2 text-[10px] font-semibold text-slate-600 transition hover:border-cyan-200 hover:text-cyan-700"
            onClick={() => onEdit(user)}
            type="button"
          >
            Editar configuración
          </button>
          <button
            className="rounded-xl bg-ink-800 px-3 py-2 text-[10px] font-semibold text-white transition hover:bg-ink-700"
            onClick={() => onToggleStatus(user.id)}
            type="button"
          >
            {user.status === 'ACTIVE' ? 'Desactivar' : 'Activar'}
          </button>
        </div>
      </div>

      <dl className="mt-6 grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:grid-cols-2">
        <div>
          <dt className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Rol</dt>
          <dd className="mt-1 text-xs font-medium text-slate-700">{getRoleLabel(user)}</dd>
        </div>
        <div>
          <dt className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Último acceso</dt>
          <dd className="mt-1 text-xs font-medium text-slate-700">
            {user.lastAccess
              ? fullDateFormatter.format(new Date(user.lastAccess))
              : 'Sin acceso todavía'}
          </dd>
        </div>
      </dl>

      <section className="mt-7">
        <h3 className="text-xs font-semibold text-slate-800">Política de acceso</h3>
        <div className="mt-3 rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-cyan-50 text-cyan-700">
              <Icon className="h-4 w-4" name="settings" />
            </span>
            <div>
              <p className="text-xs font-semibold text-slate-700">
                {user.accessPolicy.type === 'ALWAYS' ? 'Acceso 24/7' : 'Acceso restringido'}
              </p>
              <p className="mt-0.5 text-[10px] leading-4 text-slate-400">
                {user.accessPolicy.type === 'ALWAYS'
                  ? 'Sin restricción horaria en esta maqueta.'
                  : `${allowedDayLabels.join(', ')} · ${user.accessPolicy.startTime}–${user.accessPolicy.endTime}`}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-7">
        <h3 className="text-xs font-semibold text-slate-800">Permisos por módulo</h3>
        <div className="mt-3 divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200">
          {userModules.map((module) => {
            const assignedActions = permissionActions.filter((action) =>
              user.permissions[module.id].includes(action.id),
            )
            return (
              <div className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between" key={module.id}>
                <p className="text-xs font-semibold text-slate-700">{module.label}</p>
                <div className="flex flex-wrap gap-1.5">
                  {assignedActions.length > 0 ? (
                    assignedActions.map((action) => (
                      <span className="rounded-md bg-slate-100 px-2 py-1 text-[9px] font-semibold text-slate-600" key={action.id}>
                        {action.label}
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] text-slate-400">Sin acceso</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="mt-7">
        <h3 className="text-xs font-semibold text-slate-800">Actividad reciente mock</h3>
        {user.recentActivity.length > 0 ? (
          <ol className="mt-4 space-y-0">
            {user.recentActivity.map((activity, index) => (
              <li className="relative grid grid-cols-[20px_1fr] gap-3 pb-5" key={activity.id}>
                {index < user.recentActivity.length - 1 && (
                  <span className="absolute left-[9px] top-3 h-full w-px bg-slate-200" />
                )}
                <span className="relative mt-1 h-5 w-5 rounded-full border-4 border-white bg-cyan-500 ring-1 ring-cyan-200" />
                <div>
                  <p className="text-xs leading-5 text-slate-600">{activity.description}</p>
                  <time className="mt-1 block text-[10px] text-slate-400">
                    {fullDateFormatter.format(new Date(activity.timestamp))}
                  </time>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-3 rounded-xl border border-dashed border-slate-200 p-4 text-xs text-slate-400">
            Este usuario todavía no tiene actividad simulada.
          </p>
        )}
      </section>
    </DetailDrawer>
  )
}
