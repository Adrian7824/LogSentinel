import { roleDefinitions } from '../../data/usersMock'
import type { UserAccount } from '../../types/user'
import { Icon } from '../icons/Icon'
import { UserStatusBadge } from './UserStatusBadge'

type UsersTableProps = {
  users: UserAccount[]
  onSelect: (user: UserAccount) => void
  onEdit: (user: UserAccount) => void
  onToggleStatus: (userId: string) => void
}

const dateFormatter = new Intl.DateTimeFormat('es-MX', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
})

function formatLastAccess(timestamp: string | null) {
  return timestamp ? dateFormatter.format(new Date(timestamp)) : 'Sin acceso todavía'
}

function getRoleLabel(user: UserAccount) {
  return roleDefinitions.find((role) => role.id === user.role)?.label ?? user.role
}

function countPermissions(user: UserAccount) {
  return Object.values(user.permissions).reduce((total, actions) => total + actions.length, 0)
}

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

export function UsersTable({ users, onSelect, onEdit, onToggleStatus }: UsersTableProps) {
  if (users.length === 0) {
    return (
      <div className="grid min-h-72 place-items-center px-6 text-center">
        <div>
          <p className="text-sm font-semibold text-slate-700">No hay usuarios con estos filtros</p>
          <p className="mt-1 text-xs text-slate-400">Prueba otra búsqueda, rol o estado.</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-3 p-4 lg:hidden">
        {users.map((user) => (
          <article className="rounded-xl border border-slate-200 p-4" key={user.id}>
            <button className="w-full text-left" onClick={() => onSelect(user)} type="button">
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ink-800 text-[11px] font-semibold text-white">
                  {getInitials(user.name)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800">{user.name}</p>
                  <p className="mt-0.5 truncate text-[11px] text-slate-400">{user.email}</p>
                </div>
                <UserStatusBadge status={user.status} />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">Rol</p>
                  <p className="mt-1 text-[11px] font-medium text-slate-700">{getRoleLabel(user)}</p>
                </div>
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">Acceso</p>
                  <p className="mt-1 text-[11px] font-medium text-slate-700">
                    {user.accessPolicy.type === 'ALWAYS' ? '24/7' : 'Restringido'}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-[10px] text-slate-400">
                Último acceso: {formatLastAccess(user.lastAccess)}
              </p>
            </button>
            <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">
              <button
                className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-[10px] font-semibold text-slate-600 transition hover:bg-slate-50"
                onClick={() => onEdit(user)}
                type="button"
              >
                Editar
              </button>
              <button
                className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-[10px] font-semibold text-slate-600 transition hover:bg-slate-50"
                onClick={() => onToggleStatus(user.id)}
                type="button"
              >
                {user.status === 'ACTIVE' ? 'Desactivar' : 'Activar'}
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[1120px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              <th className="px-6 py-3.5">Usuario</th>
              <th className="px-4 py-3.5">Rol</th>
              <th className="px-4 py-3.5">Estado</th>
              <th className="px-4 py-3.5">Último acceso</th>
              <th className="px-4 py-3.5">Tipo de acceso</th>
              <th className="px-4 py-3.5">Permisos</th>
              <th className="px-6 py-3.5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr className="group transition-colors hover:bg-slate-50/70" key={user.id}>
                <td className="max-w-[280px] px-6 py-4">
                  <button
                    className="flex max-w-full items-center gap-3 text-left"
                    onClick={() => onSelect(user)}
                    type="button"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-ink-800 text-[10px] font-semibold text-white">
                      {getInitials(user.name)}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-xs font-semibold text-slate-700">{user.name}</span>
                      <span className="mt-1 block truncate text-[10px] text-slate-400">{user.email}</span>
                    </span>
                  </button>
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-xs font-medium text-slate-600">
                  {getRoleLabel(user)}
                </td>
                <td className="px-4 py-4"><UserStatusBadge status={user.status} /></td>
                <td className="whitespace-nowrap px-4 py-4 text-[11px] text-slate-500">
                  {formatLastAccess(user.lastAccess)}
                </td>
                <td className="whitespace-nowrap px-4 py-4">
                  <span className="rounded-lg bg-cyan-50 px-2 py-1 text-[10px] font-semibold text-cyan-700">
                    {user.accessPolicy.type === 'ALWAYS' ? 'Acceso 24/7' : 'Restringido'}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-[11px] text-slate-500">
                  {countPermissions(user)} asignaciones
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      className="rounded-lg border border-slate-200 px-3 py-2 text-[10px] font-semibold text-slate-600 transition hover:border-cyan-200 hover:text-cyan-700"
                      onClick={() => onEdit(user)}
                      type="button"
                    >
                      Editar
                    </button>
                    <button
                      aria-label={`Ver detalle de ${user.name}`}
                      className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-cyan-50 hover:text-cyan-700"
                      onClick={() => onSelect(user)}
                      type="button"
                    >
                      <Icon className="h-4 w-4" name="chevron" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
