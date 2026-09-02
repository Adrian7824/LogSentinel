import { mockUsers } from '../data/usersMock'
import type { UserAccount } from '../types/user'

let sessionUsers = mockUsers

export function getSessionUsers() {
  return sessionUsers
}

export function saveSessionUsers(users: UserAccount[]) {
  sessionUsers = users
}
