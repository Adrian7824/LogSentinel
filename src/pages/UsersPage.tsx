import { useMemo, useState } from 'react'
import { Icon } from '../components/icons/Icon'
import { Pagination } from '../components/ui/Pagination'
import { UserDetailPanel } from '../components/users/UserDetailPanel'
import { UserEditorDrawer } from '../components/users/UserEditorDrawer'
import { UserFilters } from '../components/users/UserFilters'
import { UsersTable } from '../components/users/UsersTable'
import { roleDefinitions } from '../data/usersMock'
import { getSessionUsers, saveSessionUsers } from '../services/userMockService'
import type { UserAccount, UserFiltersState } from '../types/user'

const pageSize = 6
const initialFilters: UserFiltersState = { search: '', role: 'all', status: 'all' }

function getNextUserId(users: UserAccount[]) {
  const nextNumber = Math.max(...users.map((user) => Number(user.id.replace('USR-', ''))), 0) + 1
  return `USR-${String(nextNumber).padStart(3, '0')}`
}

export function UsersPage() {
  const [users, setUsers] = useState<UserAccount[]>(getSessionUsers)
  const [filters, setFilters] = useState<UserFiltersState>(initialFilters)
  const [page, setPage] = useState(1)
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null)
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null)
  const [isEditorOpen, setIsEditorOpen] = useState(false)

  const filteredUsers = useMemo(() => {
    const search = filters.search.trim().toLocaleLowerCase('es-MX')
    return users.filter(
      (user) =>
        (search === '' ||
          `${user.name} ${user.email}`.toLocaleLowerCase('es-MX').includes(search)) &&
        (filters.role === 'all' || user.role === filters.role) &&
        (filters.status === 'all' || user.status === filters.status),
    )
  }, [filters, users])

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const visibleUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  )

  const updateFilters = (nextFilters: UserFiltersState) => {
    setFilters(nextFilters)
    setPage(1)
  }

  const openEditor = (user: UserAccount | null) => {
    setSelectedUser(null)
    setEditingUser(user)
    setIsEditorOpen(true)
  }

  const saveUser = (user: UserAccount) => {
    setUsers((currentUsers) => {
      const exists = currentUsers.some((currentUser) => currentUser.id === user.id)
      const nextUsers = exists
        ? currentUsers.map((currentUser) => (currentUser.id === user.id ? user : currentUser))
        : [user, ...currentUsers]
      saveSessionUsers(nextUsers)
      return nextUsers
    })
    setIsEditorOpen(false)
    setEditingUser(null)
    setSelectedUser(user)
  }

  const toggleUserStatus = (userId: string) => {
    setUsers((currentUsers) => {
      const nextUsers = currentUsers.map<UserAccount>((user) =>
        user.id === userId
          ? { ...user, status: user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' }
          : user,
      )
      saveSessionUsers(nextUsers)
      return nextUsers
    })
    setSelectedUser((currentUser) =>
      currentUser?.id === userId
        ? {
            ...currentUser,
            status: currentUser.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
          }
        : currentUser,
    )
  }

  return (
    <section aria-labelledby="users-title" className="mx-auto max-w-[1500px]">
      <div className="mb-6 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400">
            <span>LogSentinel</span>
            <Icon className="h-3.5 w-3.5" name="chevron" />
            <span className="text-slate-600">Usuarios</span>
          </div>
          <h2
            className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl"
            id="users-title"
          >
            Usuarios y control de acceso
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Administra perfiles, permisos por módulo y políticas horarias de acceso.
          </p>
        </div>

        <button
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-ink-800 px-4 py-3 text-xs font-semibold text-white shadow-sm transition hover:bg-ink-700"
          onClick={() => openEditor(null)}
          type="button"
        >
          <Icon className="h-4 w-4 text-cyan-300" name="users" />
          Crear usuario
        </button>
      </div>

      <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/70 px-4 py-3 text-amber-800 sm:px-5">
        <Icon className="mt-0.5 h-4 w-4 shrink-0" name="incidents" />
        <p className="text-[11px] leading-5">
          Demostración RBAC: los usuarios y cambios se conservan únicamente en memoria hasta recargar la página. No existe autenticación ni autorización backend.
        </p>
      </div>

      <div className="mb-5 grid gap-3 md:grid-cols-3">
        {roleDefinitions.map((role) => {
          const count = users.filter((user) => user.role === role.id).length
          return (
            <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm" key={role.id}>
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-xs font-semibold text-slate-800">{role.label}</h3>
                <span className="grid h-8 min-w-8 place-items-center rounded-lg bg-cyan-50 px-2 text-sm font-semibold text-cyan-700">
                  {count}
                </span>
              </div>
              <p className="mt-2 text-[10px] leading-4 text-slate-400">{role.description}</p>
            </article>
          )
        })}
      </div>

      <UserFilters
        filters={filters}
        onChange={updateFilters}
        onReset={() => updateFilters(initialFilters)}
      />

      <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-panel">
        <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Usuarios registrados</h3>
            <p className="mt-1 text-xs text-slate-500">
              {filteredUsers.length}{' '}
              {filteredUsers.length === 1 ? 'usuario encontrado' : 'usuarios encontrados'}
            </p>
          </div>
          <p className="text-[10px] font-medium text-slate-400">Cambios locales de demostración</p>
        </div>

        <UsersTable
          onEdit={openEditor}
          onSelect={setSelectedUser}
          onToggleStatus={toggleUserStatus}
          users={visibleUsers}
        />
        <Pagination
          currentPage={currentPage}
          onPageChange={setPage}
          pageSize={pageSize}
          totalItems={filteredUsers.length}
          totalPages={totalPages}
        />
      </div>

      <UserDetailPanel
        onClose={() => setSelectedUser(null)}
        onEdit={openEditor}
        onToggleStatus={toggleUserStatus}
        user={selectedUser}
      />

      {isEditorOpen && (
        <UserEditorDrawer
          key={editingUser?.id ?? 'new-user'}
          newUserId={getNextUserId(users)}
          onClose={() => {
            setIsEditorOpen(false)
            setEditingUser(null)
          }}
          onSave={saveUser}
          user={editingUser}
        />
      )}
    </section>
  )
}
