import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Wallet } from 'lucide-react'
import StepIndicator from './StepIndicator'
import ServiceSelector from './ServiceSelector'
import DateTimeSelector from './DateTimeSelector'
import ContactForm from './ContactForm'
import BookingSummary from './BookingSummary'
import DepositBreakdown from './DepositBreakdown'
import PaymentModal from './PaymentModal'
import { SERVICES, BOOKED_SLOTS } from '../data/mockData'
import { TIME_SLOTS, buildBusyIntervals, getBlockedSlots } from '../data/schedule'
import { getFirstAvailableDate } from '../data/utils'

const BarberSelector = lazy(() => import('./BarberSelector'))

const STEP_META = {
  service: { title: '¿Qué tratamiento querés reservar?', label: 'Tratamiento' },
  specialist: { title: '¿Con qué especialista preferís atenderte?', label: 'Especialista' },
  datetime: { title: 'Elegí el día y horario', label: 'Fecha y hora' },
  contact: { title: 'Casi listo, dejanos tus datos', label: 'Tus datos' },
}

export default function BookingFlow({
  existingAppointments,
  professionals,
  initialServiceId,
  blockedDates = [],
  onComplete,
}) {
  const activeProfessionals = useMemo(
    () => professionals.filter((p) => p.status === 'active'),
    [professionals],
  )
  const hasMultipleSpecialists = activeProfessionals.length > 1

  // Con un solo equipo activo no tiene sentido pedirle al cliente que lo
  // elija: se salta ese paso y se asigna automáticamente.
  const steps = useMemo(
    () => (hasMultipleSpecialists ? ['service', 'specialist', 'datetime', 'contact'] : ['service', 'datetime', 'contact']),
    [hasMultipleSpecialists],
  )

  const [stepIndex, setStepIndex] = useState(0)
  const [serviceId, setServiceId] = useState(initialServiceId ?? null)
  const [barberId, setBarberId] = useState(
    activeProfessionals.length === 1 ? activeProfessionals[0].id : null,
  )
  const [date, setDate] = useState(() => getFirstAvailableDate(blockedDates))
  const [time, setTime] = useState(null)
  const [clientName, setClientName] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [attemptedSubmit, setAttemptedSubmit] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [paymentKey, setPaymentKey] = useState(0)

  useEffect(() => {
    if (activeProfessionals.length === 1) setBarberId(activeProfessionals[0].id)
  }, [activeProfessionals])

  // Si se llegó acá con un servicio preseleccionado (botón "Reservar este
  // servicio" de la vitrina), el scroll genérico a #reservar no alcanza
  // cuando ese tratamiento queda varias filas más abajo en la grilla de 11
  // tarjetas: el usuario aterriza viendo la primera y cree que no se
  // seleccionó nada. Acá se enfoca la tarjeta elegida en cuanto se pinta,
  // una sola vez por montaje (no se repite al volver del paso 2 al 1).
  useEffect(() => {
    if (!initialServiceId) return
    const frame = requestAnimationFrame(() => {
      document
        .getElementById(`service-option-${initialServiceId}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
    return () => cancelAnimationFrame(frame)
    // Solo al montar: no queremos volver a saltar si el usuario navega
    // manualmente de vuelta al paso 1 más tarde.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Al cambiar de paso, el contenido puede volverse mucho más bajo (p. ej.
  // pasar de la grilla de 11 tratamientos al calendario). Si no se corrige,
  // el scroll absoluto de la página queda apuntando a donde antes estaba el
  // paso anterior, que ahora cae sobre Políticas/Ubicación/Footer. Se
  // compara contra el último paso para el que ya se hizo scroll (en vez de
  // una bandera de "primera vez") porque React StrictMode invoca los
  // efectos dos veces en desarrollo, y una bandera booleana se "gasta" en
  // esa primera invocación falsa y termina disparando el scroll de todos
  // modos en la segunda.
  const lastScrolledStep = useRef(stepIndex)
  useEffect(() => {
    if (stepIndex === lastScrolledStep.current) return
    lastScrolledStep.current = stepIndex
    document
      .getElementById('reserva-paso-actual')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [stepIndex])

  const currentStepKey = steps[stepIndex]

  const service = useMemo(
    () => SERVICES.find((s) => s.id === serviceId) ?? null,
    [serviceId],
  )
  const barber = useMemo(
    () => professionals.find((b) => b.id === barberId) ?? null,
    [barberId, professionals],
  )

  // Intervalos ya ocupados ese día para esta especialista: los turnos de
  // ejemplo (BOOKED_SLOTS) más los turnos reales de la sesión, cada uno con
  // la duración real de SU servicio (no un slot fijo de 30 min para todos).
  const busyIntervals = useMemo(() => {
    if (!barberId) return []
    const base = BOOKED_SLOTS[barberId] ?? []
    const fromSession = existingAppointments
      .filter(
        (a) => a.barberId === barberId && a.date === date && a.status !== 'cancelled',
      )
      .map((a) => ({
        time: a.time,
        duration: SERVICES.find((s) => s.id === a.serviceId)?.duration ?? 30,
      }))
    return buildBusyIntervals([...base, ...fromSession])
  }, [barberId, date, existingAppointments])

  // Con la duración del servicio elegido, calcula qué horarios de inicio no
  // entran antes de que cierre la franja (mañana/tarde) o se pisan con
  // algún turno ya ocupado.
  const bookedSlots = useMemo(() => {
    if (!service) return []
    return getBlockedSlots(service.duration, busyIntervals)
  }, [service, busyIntervals])

  const isDateBlocked = blockedDates.includes(date)

  const canContinue = {
    service: Boolean(serviceId),
    specialist: Boolean(barberId),
    datetime: Boolean(date && time) && !isDateBlocked,
    contact: clientName.trim().length > 1 && clientPhone.trim().length > 6,
  }[currentStepKey]

  function handleNext() {
    if (!canContinue) {
      setAttemptedSubmit(true)
      return
    }
    if (stepIndex < steps.length - 1) {
      setAttemptedSubmit(false)
      setStepIndex((i) => i + 1)
    } else {
      setPaymentKey((k) => k + 1)
      setShowPayment(true)
    }
  }

  function handlePaymentConfirmed() {
    setShowPayment(false)
    onComplete({
      id: `booking-${Date.now()}`,
      service,
      barber,
      serviceId,
      barberId,
      date,
      time,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      notes: notes.trim(),
    })
  }

  // Click en "Elegir y Continuar" dentro de la tarjeta ya seleccionada:
  // confirma el tratamiento y avanza directo al paso siguiente, sin obligar
  // a bajar hasta el botón "Continuar" al pie de las 11 tarjetas.
  function handleSelectAndAdvance(id) {
    setServiceId(id)
    setAttemptedSubmit(false)
    setStepIndex((i) => Math.min(i + 1, steps.length - 1))
  }

  function handleBack() {
    setAttemptedSubmit(false)
    setStepIndex((i) => Math.max(0, i - 1))
  }

  function handleSelectTime(slot) {
    if (bookedSlots.includes(slot)) return
    setTime(slot)
  }

  function handleSelectDate(iso) {
    setDate(iso)
    setTime(null)
  }

  const isLastStep = stepIndex === steps.length - 1

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <StepIndicator
        steps={steps.map((key) => STEP_META[key].label)}
        currentStep={stepIndex + 1}
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_280px]">
        <div
          id="reserva-paso-actual"
          className="min-w-0 scroll-mt-24 rounded-3xl border border-nude/70 bg-white/60 p-5 shadow-2xl shadow-rose-gold-deep/10 backdrop-blur-md sm:p-7"
        >
          <h2 className="font-serif text-xl font-semibold text-plum">
            {STEP_META[currentStepKey].title}
          </h2>
          <div className="mt-5">
            {currentStepKey === 'service' && (
              <ServiceSelector
                services={SERVICES}
                selectedId={serviceId}
                onSelect={setServiceId}
                onConfirm={handleSelectAndAdvance}
              />
            )}
            {currentStepKey === 'specialist' && (
              <Suspense fallback={null}>
                <BarberSelector
                  barbers={activeProfessionals}
                  selectedId={barberId}
                  onSelect={setBarberId}
                />
              </Suspense>
            )}
            {currentStepKey === 'datetime' && (
              <DateTimeSelector
                timeSlots={TIME_SLOTS}
                bookedSlots={bookedSlots}
                selectedDate={date}
                selectedTime={time}
                blockedDates={blockedDates}
                isDateBlocked={isDateBlocked}
                onSelectDate={handleSelectDate}
                onSelectTime={handleSelectTime}
              />
            )}
            {currentStepKey === 'contact' && (
              <>
                <DepositBreakdown service={service} />
                <ContactForm
                  name={clientName}
                  phone={clientPhone}
                  notes={notes}
                  onChangeName={setClientName}
                  onChangePhone={setClientPhone}
                  onChangeNotes={setNotes}
                  attemptedSubmit={attemptedSubmit}
                />
              </>
            )}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={handleBack}
              disabled={stepIndex === 0}
              className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-muted transition hover:text-plum disabled:cursor-not-allowed disabled:opacity-0"
            >
              <ChevronLeft size={16} aria-hidden="true" />
              Volver
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={isLastStep ? false : !canContinue}
              aria-disabled={!canContinue}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                canContinue
                  ? isLastStep
                    ? 'bg-[#00aaef] text-white hover:bg-[#0090c8]'
                    : 'bg-gradient-to-r from-rose-gold to-champagne text-obsidian shadow-lg shadow-rose-gold-deep/30 hover:brightness-105'
                  : isLastStep
                    ? 'cursor-pointer bg-nude/40 text-plum/70 hover:bg-nude/60'
                    : 'cursor-not-allowed bg-nude/30 text-plum/30'
              }`}
            >
              {isLastStep ? (
                <>
                  <Wallet size={16} aria-hidden="true" />
                  Pagar con Mercado Pago
                </>
              ) : (
                <>
                  Continuar
                  <ChevronRight size={16} aria-hidden="true" />
                </>
              )}
            </button>
          </div>
        </div>

        <div className="hidden lg:block">
          <BookingSummary service={service} barber={barber} date={date} time={time} />
        </div>
      </div>

      <PaymentModal
        key={paymentKey}
        open={showPayment}
        amount={service?.deposit}
        onClose={() => setShowPayment(false)}
        onConfirm={handlePaymentConfirmed}
      />

      <div className="mt-6 lg:hidden">
        <BookingSummary service={service} barber={barber} date={date} time={time} />
      </div>
    </div>
  )
}
