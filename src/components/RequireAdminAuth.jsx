import { Navigate } from 'react-router-dom'

export default function RequireAdminAuth({ isAuthenticated, children }) {
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }
  return children
}
