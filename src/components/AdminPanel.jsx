import { useMemo, useState } from 'react'
import { CalendarDays, Users, Wallet, Search, X, CalendarClock, Receipt, CalendarOff } from 'lucide-react'
import { SERVICES } from '../data/mockData'
import {
  formatDateLong,
  formatDateShort,
  formatPrice,
  getMonthBoundsForDate,
  getMonthLabel,
  getWeekBoundsForDate,
  getWeekDates,
  normalizeText,
  todayISO,
} from '../data/utils'
import ProfessionalsManager from './ProfessionalsManager'
import AppointmentsTable from './AppointmentsTable'
import AdminHistory from './AdminHistory'
import BlockedDatesManager from './BlockedDatesManager'

function findService(id) {
  return SERVICES.find((s) => s.id === id)
}

const AGENDA_VIEWS = [
  { value: 'day', label: 'Día' },
  { value: 'week', label: 'Semana' },
  { value: 'month', label: 'Mes' },
]

const WEEKDAY_LABELS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

export default function AdminPanel({
  appointments,
  onSendReminder,
  onCancelAppointment,
  professionals,
  onAddProfessional,
  onToggleProfessionalStatus,
  onRemoveProfessional,
  onUpdatePaymentStatus,
  onUpdateNotes,
  blockedDates,
  onAddBlockedDates,
  onRemoveBlockedDates,
}) {
  const [tab, setTab] = useState('turnos')
  const [viewDate, setViewDate] = useState(todayISO())
  const [agendaView, setAgendaView] = useState('day')
  const [searchQuery, setSearchQuery] = useState('')
  const today = todayISO()

  const activeProfessionalsCount = useMemo(
    () => professionals.filter((p) => p.status === 'active').length,
    [professionals],
  )

  // Estadísticas: siempre reflejan el día de hoy, sin importar qué fecha se
  // esté mirando en la tabla de abajo.
  const todayAppointments = useMemo(
    () => appointments.filter((a) => a.date === today),
    [appointments, today],
  )

  const activeAppointments = useMemo(
    () => todayAppointments.filter((a) => a.status !== 'cancelled'),
    [todayAppointments],
  )

  const totalIncome = activeAppointments.reduce((sum, a) => {
    const service = findService(a.serviceId)
    return sum + (service?.price ?? 0)
  }, 0)

  const searchedQuery = normalizeText(searchQuery.trim())

  function matchesSearch(appointment) {
    if (!searchedQuery) return true
    const service = findService(appointment.serviceId)
    const barber = professionals.find((p) => p.id === appointment.barberId)
    const haystack = normalizeText(
      [appointment.clientName, appointment.clientPhone, appointment.time, service?.name, barber?.name]
        .filter(Boolean)
        .join(' '),
    )
    return haystack.includes(searchedQuery)
  }

  // Vista Día: turnos de la fecha exacta elegida en el datepicker.
  const dayAppointments = useMemo(() => {
    return appointments
      .filter((a) => a.date === viewDate)
      .filter(matchesSearch)
      .sort((a, b) => a.time.localeCompare(b.time))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointments, viewDate, searchedQuery, professionals])

  // Vista Semana: la semana (lunes a domingo) que contiene la fecha
  // elegida, agrupada día por día en orden cronológico.
  const weekBounds = useMemo(() => getWeekBoundsForDate(viewDate), [viewDate])
  const weekDates = useMemo(() => getWeekDates(viewDate), [viewDate])
  const weekAppointmentsByDate = useMemo(() => {
    const map = new Map()
    for (const date of weekDates) {
      map.set(
        date,
        appointments
          .filter((a) => a.date === date)
          .filter(matchesSearch)
          .sort((a, b) => a.time.localeCompare(b.time)),
      )
    }
    return map
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointments, weekDates, searchedQuery, professionals])

  // Vista Mes: todos los turnos del mes calendario que contiene la fecha
  // elegida, en una sola lista con la fecha de cada uno bien visible.
  const monthBounds = useMemo(() => getMonthBoundsForDate(viewDate), [viewDate])
  const viewMonthLabel = useMemo(() => {
    const [year, month] = viewDate.split('-').map(Number)
    return getMonthLabel(year, month - 1)
  }, [viewDate])
  const monthAppointments = useMemo(() => {
    return appointments
      .filter((a) => a.date >= monthBounds.from && a.date <= monthBounds.to)
      .filter(matchesSearch)
      .sort((a, b) => (a.date === b.date ? a.time.localeCompare(b.time) : a.date.localeCompare(b.date)))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointments, monthBounds, searchedQuery, professionals])

  function handleJumpToToday() {
    setTab('turnos')
    setAgendaView('day')
    setViewDate(today)
    document
      .getElementById('turnos-tabla')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function handleJumpToProfessionals() {
    document
      .getElementById('profesionales')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-plum">Panel Admin</h1>
        <p className="mt-1 text-sm text-muted">
          Buscá y gestioná los turnos, la contabilidad y el equipo del estudio.
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <button
          type="button"
          onClick={handleJumpToToday}
          className="rounded-3xl border border-nude/70 bg-white/55 p-4 text-left shadow-xl shadow-rose-gold-deep/10 backdrop-blur-md transition hover:border-rose-gold-deep/50 hover:bg-white/75"
        >
          <div className="flex items-center gap-2 text-muted">
            <CalendarDays size={15} aria-hidden="true" />
            <span className="text-xs uppercase tracking-wide">Turnos hoy</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-plum">
            {activeAppointments.length}
          </p>
        </button>
        <button
          type="button"
          onClick={handleJumpToProfessionals}
          className="rounded-3xl border border-nude/70 bg-white/55 p-4 text-left shadow-xl shadow-rose-gold-deep/10 backdrop-blur-md transition hover:border-rose-gold-deep/50 hover:bg-white/75"
        >
          <div className="flex items-center gap-2 text-muted">
            <Users size={15} aria-hidden="true" />
            <span className="text-xs uppercase tracking-wide">Especialistas activas</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-plum">{activeProfessionalsCount}</p>
        </button>
        <div className="rounded-3xl border border-nude/70 bg-white/55 p-4 shadow-xl shadow-rose-gold-deep/10 backdrop-blur-md">
          <div className="flex items-center gap-2 text-muted">
            <Wallet size={15} aria-hidden="true" />
            <span className="text-xs uppercase tracking-wide">Ingresos estimados hoy</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-rose-gold-deep">
            {formatPrice(totalIncome)}
          </p>
        </div>
      </div>

      <div className="mb-6 flex items-center gap-1.5 rounded-full border border-nude/70 bg-white/50 p-1 sm:w-fit">
        <button
          type="button"
          onClick={() => setTab('turnos')}
          aria-pressed={tab === 'turnos'}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition sm:flex-none ${
            tab === 'turnos'
              ? 'bg-gradient-to-r from-rose-gold to-champagne text-obsidian'
              : 'text-plum/70 hover:text-plum'
          }`}
        >
          <CalendarClock size={15} aria-hidden="true" />
          Turnos
        </button>
        <button
          type="button"
          onClick={() => setTab('historial')}
          aria-pressed={tab === 'historial'}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition sm:flex-none ${
            tab === 'historial'
              ? 'bg-gradient-to-r from-rose-gold to-champagne text-obsidian'
              : 'text-plum/70 hover:text-plum'
          }`}
        >
          <Receipt size={15} aria-hidden="true" />
          Historial & Contabilidad
        </button>
        <button
          type="button"
          onClick={() => setTab('vacaciones')}
          aria-pressed={tab === 'vacaciones'}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition sm:flex-none ${
            tab === 'vacaciones'
              ? 'bg-gradient-to-r from-rose-gold to-champagne text-obsidian'
              : 'text-plum/70 hover:text-plum'
          }`}
        >
          <CalendarOff size={15} aria-hidden="true" />
          Vacaciones
        </button>
      </div>

      {tab === 'turnos' && (
        <div id="turnos-tabla" className="scroll-mt-24">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium uppercase tracking-wide text-muted">
                Ver turnos del
              </span>
              <input
                type="date"
                value={viewDate}
                onChange={(event) => setViewDate(event.target.value)}
                className="rounded-xl border border-nude bg-white/70 px-3.5 py-2.5 text-sm text-plum focus:border-rose-gold-deep focus:outline-none"
              />
            </label>

            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium uppercase tracking-wide text-muted">
                Vista
              </span>
              <div className="flex items-center gap-1.5 rounded-full border border-nude/70 bg-white/50 p-1">
                {AGENDA_VIEWS.map((view) => (
                  <button
                    key={view.value}
                    type="button"
                    onClick={() => setAgendaView(view.value)}
                    aria-pressed={agendaView === view.value}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition sm:text-sm ${
                      agendaView === view.value
                        ? 'bg-gradient-to-r from-rose-gold to-champagne text-obsidian'
                        : 'text-plum/70 hover:text-plum'
                    }`}
                  >
                    {view.label}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex flex-1 flex-col gap-1.5">
              <span className="text-xs font-medium uppercase tracking-wide text-muted">
                Buscar
              </span>
              <div className="flex items-center gap-2 rounded-xl border border-nude bg-white/70 px-3.5 py-2.5 focus-within:border-rose-gold-deep">
                <Search size={15} className="flex-shrink-0 text-muted/60" aria-hidden="true" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Cliente, horario, servicio o especialista..."
                  className="w-full bg-transparent text-sm text-plum placeholder:text-muted/50 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Limpiar búsqueda"
                    className="flex-shrink-0 text-muted transition hover:text-plum"
                  >
                    <X size={15} aria-hidden="true" />
                  </button>
                )}
              </div>
            </label>
            {viewDate !== today && (
              <button
                type="button"
                onClick={() => setViewDate(today)}
                className="rounded-full border border-nude bg-white/60 px-4 py-2.5 text-sm font-medium text-plum/70 transition hover:border-rose-gold-deep/50 hover:text-plum"
              >
                Volver a hoy
              </button>
            )}
          </div>

          {agendaView === 'day' && (
            <>
              <p className="mb-3 text-xs text-muted">
                Mostrando turnos del{' '}
                <span className="font-medium text-plum/70 capitalize">
                  {formatDateLong(viewDate)}
                </span>
              </p>
              <AppointmentsTable
                appointments={dayAppointments}
                professionals={professionals}
                onCancelAppointment={onCancelAppointment}
                onSendReminder={onSendReminder}
                onUpdatePaymentStatus={onUpdatePaymentStatus}
                onUpdateNotes={onUpdateNotes}
                emptyMessage={
                  searchQuery
                    ? `No se encontraron turnos para "${searchQuery}".`
                    : 'No hay turnos agendados para esta fecha.'
                }
              />
            </>
          )}

          {agendaView === 'week' && (
            <div className="flex flex-col gap-6">
              <p className="text-sm text-plum">
                Semana del{' '}
                <span className="font-semibold">Lunes {formatDateShort(weekBounds.from)}</span>{' '}
                al <span className="font-semibold">Domingo {formatDateShort(weekBounds.to)}</span>
              </p>
              {weekDates.map((date, index) => {
                const dayAppointmentsForDate = weekAppointmentsByDate.get(date) ?? []
                const isToday = date === today
                return (
                  <div key={date}>
                    <p className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted">
                      {WEEKDAY_LABELS[index]} {formatDateShort(date)}
                      {isToday && (
                        <span className="rounded-full bg-champagne/20 px-2 py-0.5 text-[10px] font-semibold text-plum">
                          Hoy
                        </span>
                      )}
                      <span className="text-plum/50">
                        · {dayAppointmentsForDate.length}{' '}
                        {dayAppointmentsForDate.length === 1 ? 'turno' : 'turnos'}
                      </span>
                    </p>
                    {dayAppointmentsForDate.length > 0 ? (
                      <AppointmentsTable
                        appointments={dayAppointmentsForDate}
                        professionals={professionals}
                        onCancelAppointment={onCancelAppointment}
                        onSendReminder={onSendReminder}
                        onUpdatePaymentStatus={onUpdatePaymentStatus}
                        onUpdateNotes={onUpdateNotes}
                      />
                    ) : (
                      <p className="rounded-2xl border border-nude/50 bg-white/40 px-4 py-3 text-sm text-muted">
                        Sin turnos agendados.
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {agendaView === 'month' && (
            <>
              <p className="mb-3 text-xs text-muted">
                Mostrando todos los turnos de{' '}
                <span className="font-medium capitalize text-plum/70">{viewMonthLabel}</span>
              </p>
              <AppointmentsTable
                appointments={monthAppointments}
                professionals={professionals}
                onCancelAppointment={onCancelAppointment}
                onSendReminder={onSendReminder}
                onUpdatePaymentStatus={onUpdatePaymentStatus}
                onUpdateNotes={onUpdateNotes}
                showDateColumn
                emptyMessage={
                  searchQuery
                    ? `No se encontraron turnos para "${searchQuery}".`
                    : 'No hay turnos agendados este mes.'
                }
              />
            </>
          )}
        </div>
      )}

      {tab === 'historial' && (
        <AdminHistory
          appointments={appointments}
          professionals={professionals}
          onCancelAppointment={onCancelAppointment}
          onUpdatePaymentStatus={onUpdatePaymentStatus}
          onUpdateNotes={onUpdateNotes}
        />
      )}

      {tab === 'vacaciones' && (
        <BlockedDatesManager
          blockedDates={blockedDates}
          onAddDates={onAddBlockedDates}
          onRemoveDates={onRemoveBlockedDates}
        />
      )}

      <div id="profesionales" className="scroll-mt-24">
        <ProfessionalsManager
          professionals={professionals}
          onAdd={onAddProfessional}
          onToggleStatus={onToggleProfessionalStatus}
          onRemove={onRemoveProfessional}
        />
      </div>
    </div>
  )
}
