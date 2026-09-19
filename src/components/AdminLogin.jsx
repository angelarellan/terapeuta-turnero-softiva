import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { AlertCircle, ArrowLeft, Lock, Mail } from 'lucide-react'

export default function AdminLogin({ isAuthenticated, onLogin }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />
  }

  function handleSubmit(event) {
    event.preventDefault()
    const ok = onLogin(user, password)
    if (!ok) {
      setError(true)
      return
    }
    const redirectTo = location.state?.from ?? '/admin'
    navigate(redirectTo, { replace: true })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cashmere px-4 py-12">
      <div className="w-full max-w-sm rounded-3xl border border-nude/70 bg-white/60 p-8 shadow-2xl shadow-rose-gold-deep/10 backdrop-blur-md">
        <div className="flex flex-col items-center gap-2 text-center">
          <img
            src="/logo.jpg"
            alt=""
            aria-hidden="true"
            width={56}
            height={56}
            className="h-14 w-14 rounded-full object-cover shadow-sm shadow-rose-gold-deep/20"
          />
          <h1 className="font-serif text-2xl font-bold text-plum">Panel Admin</h1>
          <p className="text-sm text-muted">VR Beauty Lash — acceso privado</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-muted">
              Usuario
            </span>
            <div className="flex items-center gap-2 rounded-xl border border-nude bg-white/70 px-3.5 py-2.5 focus-within:border-rose-gold-deep">
              <Mail size={16} className="text-muted/60" aria-hidden="true" />
              <input
                type="text"
                required
                autoComplete="username"
                value={user}
                onChange={(event) => {
                  setUser(event.target.value)
                  setError(false)
                }}
                placeholder="admin@vrbeautylash.com"
                className="w-full bg-transparent text-sm text-plum placeholder:text-muted/50 focus:outline-none"
              />
            </div>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-muted">
              Contraseña
            </span>
            <div className="flex items-center gap-2 rounded-xl border border-nude bg-white/70 px-3.5 py-2.5 focus-within:border-rose-gold-deep">
              <Lock size={16} className="text-muted/60" aria-hidden="true" />
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value)
                  setError(false)
                }}
                placeholder="••••••••"
                className="w-full bg-transparent text-sm text-plum placeholder:text-muted/50 focus:outline-none"
              />
            </div>
          </label>

          {error && (
            <p
              role="alert"
              className="flex items-center gap-2 rounded-xl border border-red-300 bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-500"
            >
              <AlertCircle size={16} className="flex-shrink-0" aria-hidden="true" />
              Usuario o contraseña incorrectos.
            </p>
          )}

          <button
            type="submit"
            className="mt-2 rounded-full bg-gradient-to-r from-rose-gold to-champagne px-5 py-2.5 text-sm font-semibold text-obsidian transition hover:brightness-105"
          >
            Ingresar
          </button>
        </form>

        <Link
          to="/"
          className="mt-5 flex items-center justify-center gap-1.5 text-sm font-medium text-muted transition hover:text-plum"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          Volver al sitio
        </Link>
      </div>
    </div>
  )
}
