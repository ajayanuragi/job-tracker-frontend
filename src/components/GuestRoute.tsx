import { Navigate, Outlet } from 'react-router'
import { getToken } from '@/lib/auth'

function GuestRoute() {
  const token = getToken()

  return token ? <Navigate to="/dashboard" replace /> : <Outlet />
}

export default GuestRoute