import { Navigate, Outlet } from 'react-router'
import { Skeleton } from '../../components/feedback/Skeleton.tsx'
import { useAuth } from './useAuth.ts'

export function RequireAuth() {
  const { user, status } = useAuth()

  if (status === 'loading') {
    return (
      <div className="mx-auto max-w-md px-6 py-20" role="status" aria-label="Cargando sesión">
        <Skeleton className="h-40" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  return <Outlet />
}
