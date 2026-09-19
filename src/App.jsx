import { lazy, Suspense, useEffect, useState } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import NavBar from './components/NavBar'
import Hero from './components/Hero'
import SpecialistProfile from './components/SpecialistProfile'
import ServicesShowcase from './components/ServicesShowcase'
import BookingFlow from './components/BookingFlow'
import SuccessScreen from './components/SuccessScreen'
import PoliciesSection from './components/PoliciesSection'
import LocationSection from './components/LocationSection'
import Footer from './components/Footer'
import AdminLogin from './components/AdminLogin'
import RequireAdminAuth from './components/RequireAdminAuth'
import useAdminAuth from './auth/useAdminAuth'
import useLocalStorageState from './data/useLocalStorageState'
import { SEED_APPOINTMENTS, SEED_PROFESSIONALS, SERVICES } from './data/mockData'

const AdminPanel = lazy(() => import('./components/AdminPanel'))

export default function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const auth = useAdminAuth()

  // Persistidos en localStorage: sin esto, un F5 en el navegador volvía a
  // mostrar solo los 3 turnos de ejemplo, como si los turnos reales que
  // acababan de reservarse nunca hubiesen pasado. Ojo: esto es persistencia
  // por navegador/dispositivo, no una base de datos compartida — si la
  // dueña abre el Panel Admin desde otro dispositivo distinto al de la
  // clienta, no va a ver ese turno ahí. Sincronizar entre dispositivos de
  // verdad requiere un backend, que este sitio (100% estático) no tiene.
  const [appointments, setAppointments] = useLocalStorageState('vrbl_appointments', SEED_APPOINTMENTS)
  const [professionals, setProfessionals] = useLocalStorageState('vrbl_professionals', SEED_PROFESSIONALS)
  const [blockedDates, setBlockedDates] = useLocalStorageState('vrbl_blocked_dates', [])
  const [confirmedBooking, setConfirmedBooking] = useState(null)
  const [bookingResetKey, setBookingResetKey] = useState(0)
  const [preselectedServiceId, setPreselectedServiceId] = useState(null)

  // Hace scroll a la sección pedida desde el header en cuanto la home está
  // montada (puede requerir navegar primero desde /admin).
  useEffect(() => {
    if (location.pathname !== '/' || !location.hash) return
    document.querySelector(location.hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [location])

  function handleBookingComplete(booking) {
    setAppointments((prev) => [
      ...prev,
      {
        id: booking.id,
        clientName: booking.clientName,
        clientPhone: booking.clientPhone,
        serviceId: booking.serviceId,
        barberId: booking.barberId,
        date: booking.date,
        time: booking.time,
        reminderSent: false,
        status: 'confirmed',
        paymentStatus: 'senado_mp',
        notes: booking.notes ?? '',
      },
    ])
    setConfirmedBooking({ ...booking, paymentStatus: 'senado_mp' })
  }

  function handleReset() {
    setConfirmedBooking(null)
  }

  function handleSendReminder(id) {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, reminderSent: true } : a)),
    )
  }

  function handleCancelAppointment(id) {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'cancelled' } : a)),
    )
  }

  function handleAddProfessional(professional) {
    setProfessionals((prev) => [...prev, professional])
  }

  function handleToggleProfessionalStatus(id) {
    setProfessionals((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: p.status === 'active' ? 'vacation' : 'active' }
          : p,
      ),
    )
  }

  function handleRemoveProfessional(id) {
    setProfessionals((prev) => prev.filter((p) => p.id !== id))
  }

  function handleUpdatePaymentStatus(id, paymentStatus) {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, paymentStatus } : a)),
    )
  }

  function handleUpdateNotes(id, notes) {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, notes } : a)))
  }

  function handleAddBlockedDates(dates) {
    setBlockedDates((prev) => [...new Set([...prev, ...dates])].sort())
  }

  function handleRemoveBlockedDates(dates) {
    const toRemove = new Set(dates)
    setBlockedDates((prev) => prev.filter((iso) => !toRemove.has(iso)))
  }

  function handleGoHome() {
    setConfirmedBooking(null)
    setPreselectedServiceId(null)
    setBookingResetKey((k) => k + 1)
    navigate('/')
    // Si ya estábamos en "/", navigate("/") no dispara ningún cambio de
    // ruta ni de scroll, así que tocar el logo no hacía nada visible. Se
    // agrega el scroll al tope acá — pero reiniciar bookingResetKey
    // remonta BookingFlow, y si el scrollTo arranca en el mismo tick, el
    // "scroll anchoring" del navegador lo corta a mitad de camino apenas
    // cambia el alto del contenido. Con un doble rAF se espera a que ese
    // remount ya esté pintado antes de animar el scroll.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      })
    })
  }

  function handleSelectServiceFromShowcase(serviceId) {
    setPreselectedServiceId(serviceId)
    setBookingResetKey((k) => k + 1)
    document.getElementById('reservar')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function handleNavigate(hash) {
    navigate(`/${hash}`)
  }

  function handleLogout() {
    // Cierra sesión y deja que el guard de /admin mande sola a
    // /admin/login (desde ahí hay un link para volver al sitio). Forzar acá
    // un navigate("/") compite con ese guard —la navegación de
    // react-router es asincrónica— y terminaba ganando la redirección al
    // login de todos modos.
    auth.logout()
  }

  const isLoginRoute = location.pathname === '/admin/login'

  return (
    <div className="flex min-h-screen flex-col bg-cashmere text-plum">
      {!isLoginRoute && (
        <NavBar
          isAuthenticated={auth.isAuthenticated}
          onNavigate={handleNavigate}
          onGoHome={handleGoHome}
          onLogout={handleLogout}
        />
      )}

      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <SpecialistProfile />
                <ServicesShowcase
                  services={SERVICES}
                  onSelectService={handleSelectServiceFromShowcase}
                />
                <div id="reservar" className="scroll-mt-24">
                  {confirmedBooking ? (
                    <SuccessScreen booking={confirmedBooking} onReset={handleReset} />
                  ) : (
                    <BookingFlow
                      key={bookingResetKey}
                      existingAppointments={appointments}
                      professionals={professionals}
                      initialServiceId={preselectedServiceId}
                      blockedDates={blockedDates}
                      onComplete={handleBookingComplete}
                    />
                  )}
                </div>
                <PoliciesSection />
                <LocationSection />
              </>
            }
          />
          <Route
            path="/admin/login"
            element={<AdminLogin isAuthenticated={auth.isAuthenticated} onLogin={auth.login} />}
          />
          <Route
            path="/admin"
            element={
              <RequireAdminAuth isAuthenticated={auth.isAuthenticated}>
                <Suspense fallback={null}>
                  <AdminPanel
                    appointments={appointments}
                    onSendReminder={handleSendReminder}
                    onCancelAppointment={handleCancelAppointment}
                    professionals={professionals}
                    onAddProfessional={handleAddProfessional}
                    onToggleProfessionalStatus={handleToggleProfessionalStatus}
                    onRemoveProfessional={handleRemoveProfessional}
                    onUpdatePaymentStatus={handleUpdatePaymentStatus}
                    onUpdateNotes={handleUpdateNotes}
                    blockedDates={blockedDates}
                    onAddBlockedDates={handleAddBlockedDates}
                    onRemoveBlockedDates={handleRemoveBlockedDates}
                  />
                </Suspense>
              </RequireAdminAuth>
            }
          />
        </Routes>
      </main>

      {!isLoginRoute && <Footer />}
    </div>
  )
}
