export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'

export type UserRole = 'ADMIN' | 'OPERATOR' | 'VIEWER'

export type UserAccessType = 'ALWAYS' | 'RESTRICTED'

export type UserModule =
  | 'dashboard'
  | 'logs'
  | 'incidents'
  | 'alerts'
  | 'applications'
  | 'users'
  | 'settings'

export type PermissionAction = 'VIEW' | 'CREATE' | 'EDIT' | 'MANAGE'

export type Weekday = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN'

export type UserPermissions = Record<UserModule, PermissionAction[]>

export type UserAccessPolicy = {
  type: UserAccessType
  allowedDays: Weekday[]
  startTime: string
  endTime: string
}

export type UserActivity = {
  id: string
  timestamp: string
  description: string
}

export type UserAccount = {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  lastAccess: string | null
  accessPolicy: UserAccessPolicy
  permissions: UserPermissions
  recentActivity: UserActivity[]
}

export type UserFiltersState = {
  search: string
  role: UserRole | 'all'
  status: UserStatus | 'all'
}
