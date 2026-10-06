import { createContext, useContext } from 'react'
import type { AdminUser } from '../../services/admin/types.ts'

export type AuthStatus = 'loading' | 'ready'

export type AuthContextValue = {
  user: AdminUser | null
  status: AuthStatus
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  clear: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext)

  if (!value) {
    throw new Error('useAuth debe usarse dentro de AuthProvider.')
  }

  return value
}
