import { useCallback, useState } from 'react'

const SESSION_KEY = 'vrbl_admin_session'

// Credenciales por defecto de la dueña. Se pueden sobrescribir con
// VITE_ADMIN_USER / VITE_ADMIN_PASSWORD en un archivo .env.local (Vite solo
// expone al cliente las variables con prefijo VITE_; ADMIN_USER/ADMIN_PASSWORD
// a secas nunca llegarían al navegador).
const DEFAULT_ADMIN_USER = 'admin@vrbeautylash.com'
const DEFAULT_ADMIN_PASSWORD = 'SoftivaLash2026!'

function getAdminCredentials() {
  return {
    user: import.meta.env.VITE_ADMIN_USER || DEFAULT_ADMIN_USER,
    password: import.meta.env.VITE_ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD,
  }
}

function readSession() {
  try {
    return localStorage.getItem(SESSION_KEY) === 'true'
  } catch {
    return false
  }
}

// Guard de sesión para el Panel Admin. Importante: esto es un candado de
// interfaz, no una autenticación real — es un sitio 100% estático sin
// backend, así que cualquier credencial embebida en el JS del cliente puede
// verse inspeccionando el bundle. Sirve para que nadie entre por error o sin
// saber la clave, no para proteger datos sensibles de un atacante.
export default function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(readSession)

  const login = useCallback((user, password) => {
    const credentials = getAdminCredentials()
    const ok =
      user.trim().toLowerCase() === credentials.user.toLowerCase() &&
      password === credentials.password
    if (ok) {
      try {
        localStorage.setItem(SESSION_KEY, 'true')
      } catch {
        // localStorage no disponible (modo privado, etc.): la sesión igual
        // queda activa en memoria para esta pestaña.
      }
      setIsAuthenticated(true)
    }
    return ok
  }, [])

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(SESSION_KEY)
    } catch {
      // no-op
    }
    setIsAuthenticated(false)
  }, [])

  return { isAuthenticated, login, logout }
}
