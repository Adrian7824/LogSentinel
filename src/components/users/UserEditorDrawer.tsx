import { useState, type FormEvent } from 'react'
import {
  createPermissionsForRole,
  permissionActions,
  roleDefinitions,
  userModules,
  weekdays,
} from '../../data/usersMock'
import type {
  PermissionAction,
  UserAccount,
  UserAccessType,
  UserRole,
  UserStatus,
  Weekday,
} from '../../types/user'
import { DetailDrawer } from '../ui/DetailDrawer'

type UserEditorDrawerProps = {
  user: UserAccount | null
  newUserId: string
  onClose: () => void
  onSave: (user: UserAccount) => void
}

const inputClassName =
  'mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100'

function createEmptyUser(id: string): UserAccount {
  return {
    id,
    name: '',
    email: '',
    role: 'VIEWER',
    status: 'ACTIVE',
    lastAccess: null,
    accessPolicy: {
      type: 'RESTRICTED',
      allowedDays: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
      startTime: '08:00',
      endTime: '18:00',
    },
    permissions: createPermissionsForRole('VIEWER'),
    recentActivity: [],
  }
}

export function UserEditorDrawer({ user, newUserId, onClose, onSave }: UserEditorDrawerProps) {
  const [draft, setDraft] = useState<UserAccount>(() =>
    user
      ? {
          ...user,
          accessPolicy: { ...user.accessPolicy, allowedDays: [...user.accessPolicy.allowedDays] },
          permissions: Object.fromEntries(
            userModules.map(({ id }) => [id, [...user.permissions[id]]]),
          ) as UserAccount['permissions'],
        }
      : createEmptyUser(newUserId),
  )
  const [error, setError] = useState('')

  const updateRole = (role: UserRole) => {
    setDraft((current) => ({
      ...current,
      role,
      permissions: createPermissionsForRole(role),
    }))
  }

  const togglePermission = (moduleId: keyof UserAccount['permissions'], action: PermissionAction) => {
    setDraft((current) => {
      const currentActions = current.permissions[moduleId]
      return {
        ...current,
        permissions: {
          ...current.permissions,
          [moduleId]: currentActions.includes(action)
            ? currentActions.filter((item) => item !== action)
            : [...currentActions, action],
        },
      }
    })
  }

  const toggleDay = (day: Weekday) => {
    setDraft((current) => ({
      ...current,
      accessPolicy: {
        ...current.accessPolicy,
        allowedDays: current.accessPolicy.allowedDays.includes(day)
          ? current.accessPolicy.allowedDays.filter((item) => item !== day)
          : [...current.accessPolicy.allowedDays, day],
      },
    }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!draft.name.trim() || !draft.email.trim()) {
      setError('Completa el nombre y el correo del usuario.')
      return
    }
    if (draft.accessPolicy.type === 'RESTRICTED' && draft.accessPolicy.allowedDays.length === 0) {
      setError('Selecciona al menos un día para el acceso restringido.')
      return
    }

    onSave({
      ...draft,
      name: draft.name.trim(),
      email: draft.email.trim(),
      recentActivity: user
        ? draft.recentActivity
        : [
            {
              id: `ACT-${draft.id}`,
              timestamp: new Date().toISOString(),
              description: 'Usuario creado localmente en la demostración.',
            },
          ],
    })
  }

  return (
    <DetailDrawer
      headerContent={
        <span className="mb-2 inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-amber-700 ring-1 ring-amber-200">
          Cambios locales
        </span>
      }
      onClose={onClose}
      title={user ? 'Editar usuario' : 'Crear usuario'}
    >
      <form onSubmit={handleSubmit}>
        <section>
          <h3 className="text-xs font-semibold text-slate-800">Información general</h3>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Nombre
              <input
                className={inputClassName}
                maxLength={80}
                onChange={(event) => setDraft({ ...draft, name: event.target.value })}
                placeholder="Nombre completo"
                type="text"
                value={draft.name}
              />
            </label>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Correo
              <input
                className={inputClassName}
                maxLength={120}
                onChange={(event) => setDraft({ ...draft, email: event.target.value })}
                placeholder="usuario@empresa.com"
                type="email"
                value={draft.email}
              />
            </label>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Rol
              <select
                className={inputClassName}
                onChange={(event) => updateRole(event.target.value as UserRole)}
                value={draft.role}
              >
                {roleDefinitions.map((role) => (
                  <option key={role.id} value={role.id}>{role.label}</option>
                ))}
              </select>
            </label>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Estado
              <select
                className={inputClassName}
                onChange={(event) => setDraft({ ...draft, status: event.target.value as UserStatus })}
                value={draft.status}
              >
                <option value="ACTIVE">Activo</option>
                <option value="INACTIVE">Inactivo</option>
                <option value="SUSPENDED">Suspendido</option>
              </select>
            </label>
          </div>
        </section>

        <section className="mt-8">
          <h3 className="text-xs font-semibold text-slate-800">Política de acceso</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {([
              ['ALWAYS', 'Acceso 24/7', 'Sin restricción horaria.'],
              ['RESTRICTED', 'Acceso restringido', 'Días y horario permitidos.'],
            ] as Array<[UserAccessType, string, string]>).map(([type, label, description]) => (
              <label
                className={`cursor-pointer rounded-xl border p-4 transition ${
                  draft.accessPolicy.type === type
                    ? 'border-cyan-300 bg-cyan-50/60 ring-2 ring-cyan-100'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
                key={type}
              >
                <input
                  checked={draft.accessPolicy.type === type}
                  className="sr-only"
                  name="access-type"
                  onChange={() =>
                    setDraft({
                      ...draft,
                      accessPolicy: { ...draft.accessPolicy, type },
                    })
                  }
                  type="radio"
                />
                <span className="block text-xs font-semibold text-slate-700">{label}</span>
                <span className="mt-1 block text-[10px] text-slate-400">{description}</span>
              </label>
            ))}
          </div>

          {draft.accessPolicy.type === 'RESTRICTED' && (
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Días permitidos</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {weekdays.map((day) => {
                  const isSelected = draft.accessPolicy.allowedDays.includes(day.id)
                  return (
                    <button
                      aria-pressed={isSelected}
                      className={`grid h-9 w-9 place-items-center rounded-lg text-[10px] font-bold transition ${
                        isSelected
                          ? 'bg-cyan-600 text-white shadow-sm'
                          : 'border border-slate-200 bg-white text-slate-500 hover:border-cyan-200'
                      }`}
                      key={day.id}
                      onClick={() => toggleDay(day.id)}
                      title={day.label}
                      type="button"
                    >
                      {day.shortLabel}
                    </button>
                  )
                })}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Hora inicial
                  <input
                    className={inputClassName}
                    onChange={(event) => setDraft({
                      ...draft,
                      accessPolicy: { ...draft.accessPolicy, startTime: event.target.value },
                    })}
                    type="time"
                    value={draft.accessPolicy.startTime}
                  />
                </label>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Hora final
                  <input
                    className={inputClassName}
                    onChange={(event) => setDraft({
                      ...draft,
                      accessPolicy: { ...draft.accessPolicy, endTime: event.target.value },
                    })}
                    type="time"
                    value={draft.accessPolicy.endTime}
                  />
                </label>
              </div>
            </div>
          )}
        </section>

        <section className="mt-8">
          <div>
            <h3 className="text-xs font-semibold text-slate-800">Permisos por módulo</h3>
            <p className="mt-1 text-[10px] leading-4 text-slate-400">
              Cambiar el rol restaura los permisos sugeridos para ese perfil.
            </p>
          </div>
          <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full min-w-[520px] border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                  <th className="px-4 py-3">Módulo</th>
                  {permissionActions.map((action) => (
                    <th className="px-3 py-3 text-center" key={action.id}>{action.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {userModules.map((module) => (
                  <tr key={module.id}>
                    <td className="px-4 py-3 text-[11px] font-semibold text-slate-700">{module.label}</td>
                    {permissionActions.map((action) => (
                      <td className="px-3 py-3 text-center" key={action.id}>
                        <input
                          aria-label={`${action.label} ${module.label}`}
                          checked={draft.permissions[module.id].includes(action.id)}
                          className="h-4 w-4 rounded border-slate-300 accent-cyan-600"
                          onChange={() => togglePermission(module.id, action.id)}
                          type="checkbox"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {error && (
          <p className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700" role="alert">
            {error}
          </p>
        )}

        <div className="mt-7 flex flex-col-reverse gap-2 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
          <button
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
            onClick={onClose}
            type="button"
          >
            Cancelar
          </button>
          <button
            className="rounded-xl bg-ink-800 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-ink-700"
            type="submit"
          >
            {user ? 'Guardar cambios' : 'Crear usuario'}
          </button>
        </div>
      </form>
    </DetailDrawer>
  )
}
