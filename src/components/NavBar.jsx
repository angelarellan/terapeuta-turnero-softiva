import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ShieldCheck, CalendarClock, LogOut, Menu, X } from 'lucide-react'

const SECTION_LINKS = [
  { hash: '#inicio', label: 'Inicio' },
  { hash: '#servicios', label: 'Servicios' },
  { hash: '#reservar', label: 'Reservar' },
  { hash: '#politicas', label: 'Políticas' },
  { hash: '#ubicacion', label: 'Ubicación' },
]

export default function NavBar({ isAuthenticated, onNavigate, onGoHome, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const isAdminRoute = location.pathname.startsWith('/admin')
  const showAdminActions = isAdminRoute && isAuthenticated

  function handleLinkClick(hash) {
    setMobileOpen(false)
    onNavigate(hash)
  }

  function handleGoToAdmin() {
    setMobileOpen(false)
    navigate('/admin')
  }

  function handleGoHome() {
    setMobileOpen(false)
    onGoHome()
  }

  function handleLogout() {
    setMobileOpen(false)
    onLogout()
  }

  return (
    <header className="sticky top-0 z-40 bg-obsidian/95 text-cashmere shadow-lg shadow-obsidian/20 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <button
          type="button"
          onClick={handleGoHome}
          className="flex items-center gap-2.5 rounded-lg text-left transition hover:opacity-80"
        >
          <img
            src="/logo.jpg"
            alt=""
            aria-hidden="true"
            width={34}
            height={34}
            className="h-[34px] w-[34px] flex-shrink-0 rounded-full object-cover shadow-sm shadow-black/30"
          />
          <p className="font-serif text-base font-semibold sm:text-lg">VR Beauty Lash</p>
        </button>

        <nav aria-label="Secciones de la página" className="hidden items-center gap-1 md:flex">
          {SECTION_LINKS.map((link) => (
            <button
              key={link.hash}
              type="button"
              onClick={() => handleLinkClick(link.hash)}
              className="rounded-full px-3.5 py-1.5 text-sm font-medium text-cashmere/70 transition hover:bg-white/10 hover:text-champagne"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="hidden flex-shrink-0 items-center gap-2 md:flex">
          {showAdminActions ? (
            <>
              <button
                type="button"
                onClick={handleGoHome}
                className="flex items-center gap-1.5 rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-cashmere/85 transition hover:bg-white/10"
              >
                <CalendarClock size={15} aria-hidden="true" />
                Volver al sitio
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-rose-gold to-champagne px-4 py-2 text-sm font-semibold text-obsidian transition hover:brightness-105"
              >
                <LogOut size={15} aria-hidden="true" />
                Cerrar sesión
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleGoToAdmin}
              className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-rose-gold to-champagne px-4 py-2 text-sm font-semibold text-obsidian transition hover:brightness-105"
            >
              <ShieldCheck size={15} aria-hidden="true" />
              Panel Admin
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={mobileOpen}
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-cashmere transition hover:bg-white/10 md:hidden"
        >
          {mobileOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/10 px-4 py-3 md:hidden">
          <nav aria-label="Secciones de la página" className="flex flex-col gap-1">
            {SECTION_LINKS.map((link) => (
              <button
                key={link.hash}
                type="button"
                onClick={() => handleLinkClick(link.hash)}
                className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-cashmere/80 transition hover:bg-white/10"
              >
                {link.label}
              </button>
            ))}
            {showAdminActions ? (
              <>
                <button
                  type="button"
                  onClick={handleGoHome}
                  className="mt-1 flex items-center gap-1.5 rounded-lg border border-white/20 px-3 py-2.5 text-sm font-medium text-cashmere/85"
                >
                  <CalendarClock size={15} aria-hidden="true" />
                  Volver al sitio
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-rose-gold to-champagne px-3 py-2.5 text-sm font-semibold text-obsidian"
                >
                  <LogOut size={15} aria-hidden="true" />
                  Cerrar sesión
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleGoToAdmin}
                className="mt-1 flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-rose-gold to-champagne px-3 py-2.5 text-sm font-semibold text-obsidian"
              >
                <ShieldCheck size={15} aria-hidden="true" />
                Panel Admin
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
