import { Fragment, useEffect, useRef, useState } from 'react'
import {
  Send,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Ban,
  NotebookPen,
} from 'lucide-react'
import { SERVICES, PAYMENT_STATUSES } from '../data/mockData'
import { buildReminderMessage, buildWhatsAppUrl } from '../data/whatsapp'
import { formatDateShort } from '../data/utils'

const STATUS_STYLES = {
  amber: 'border-amber-300 bg-amber-50 text-amber-600',
  sky: 'border-sky-300 bg-sky-50 text-sky-600',
  indigo: 'border-indigo-300 bg-indigo-50 text-indigo-600',
  emerald: 'border-emerald-300 bg-emerald-50 text-emerald-600',
}

function findService(id) {
  return SERVICES.find((s) => s.id === id)
}

export default function AppointmentsTable({
  appointments,
  professionals,
  onCancelAppointment,
  onSendReminder,
  onUpdatePaymentStatus,
  onUpdateNotes,
  showReminder = true,
  showDateColumn = false,
  emptyMessage = 'No hay turnos para mostrar.',
}) {
  const [openNotesId, setOpenNotesId] = useState(null)
  const [draftNotes, setDraftNotes] = useState('')

  const scrollRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  function findBarber(id) {
    return professionals.find((b) => b.id === id)
  }

  function updateScrollState() {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateScrollState()
    document.fonts?.ready?.then(updateScrollState)
    el.addEventListener('scroll', updateScrollState)
    const resizeObserver = new ResizeObserver(updateScrollState)
    resizeObserver.observe(el)
    return () => {
      el.removeEventListener('scroll', updateScrollState)
      resizeObserver.disconnect()
    }
  }, [appointments.length])

  function scrollByAmount(direction) {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: direction * el.clientWidth * 0.7, behavior: 'smooth' })
  }

  function handleCancelAppointment(id, clientName) {
    const confirmed = window.confirm(
      `¿Confirmás cancelar el turno de ${clientName}? Se liberará el horario.`,
    )
    if (!confirmed) return
    onCancelAppointment(id)
  }

  function toggleNotes(appointment) {
    if (openNotesId === appointment.id) {
      setOpenNotesId(null)
      return
    }
    setOpenNotesId(appointment.id)
    setDraftNotes(appointment.notes ?? '')
  }

  function handleSaveNotes(id) {
    onUpdateNotes(id, draftNotes.trim())
    setOpenNotesId(null)
  }

  const columnCount = 5 + (showReminder ? 1 : 0) + (showDateColumn ? 1 : 0)

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => scrollByAmount(-1)}
        disabled={!canScrollLeft}
        aria-label="Ver columnas anteriores"
        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-nude/70 bg-white/60 text-plum/60 transition hover:border-rose-gold-deep/60 hover:text-plum disabled:pointer-events-none disabled:opacity-0"
      >
        <ChevronLeft size={16} aria-hidden="true" />
      </button>
      <div ref={scrollRef} className="overflow-x-auto rounded-2xl border border-nude/70">
        <table className="w-full min-w-[860px] border-collapse text-left text-sm">
          <thead>
            <tr className="bg-nude/25 text-xs uppercase tracking-wide text-muted">
              {showDateColumn && <th className="px-4 py-3 font-medium">Fecha</th>}
              <th className="px-4 py-3 font-medium">Hora</th>
              <th className="px-4 py-3 font-medium">Cliente</th>
              <th className="px-4 py-3 font-medium">Servicio</th>
              <th className="px-4 py-3 font-medium">Especialista</th>
              <th className="px-4 py-3 font-medium">Estado de pago</th>
              {showReminder && <th className="px-4 py-3 font-medium">Recordatorio</th>}
              <th className="px-4 py-3 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length === 0 && (
              <tr>
                <td colSpan={columnCount} className="px-4 py-8 text-center text-sm text-muted">
                  {emptyMessage}
                </td>
              </tr>
            )}
            {appointments.map((appointment) => {
              const service = findService(appointment.serviceId)
              const barber = findBarber(appointment.barberId)
              const isCancelled = appointment.status === 'cancelled'
              const statusInfo = PAYMENT_STATUSES[appointment.paymentStatus] ?? PAYMENT_STATUSES.pendiente
              const notesOpen = openNotesId === appointment.id
              const hasNotes = Boolean(appointment.notes?.trim())
              return (
                <Fragment key={appointment.id}>
                  <tr
                    className={`border-t border-nude/50 text-plum/80 ${isCancelled ? 'line-through decoration-plum/30' : ''}`}
                  >
                    {showDateColumn && (
                      <td className="whitespace-nowrap px-4 py-3 text-plum/70">
                        {formatDateShort(appointment.date)}
                      </td>
                    )}
                    <td className="px-4 py-3 font-semibold text-plum">
                      {appointment.time}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-plum">
                        {appointment.clientName}
                      </div>
                      <div className="text-xs text-muted">{appointment.clientPhone}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5">
                        {service?.icon && (
                          <service.icon size={12} className="text-rose-gold-deep" aria-hidden="true" />
                        )}
                        {service?.name}
                      </span>
                    </td>
                    <td className="px-4 py-3">{barber?.name}</td>
                    <td className="px-4 py-3">
                      <select
                        value={appointment.paymentStatus}
                        disabled={isCancelled}
                        onChange={(event) => onUpdatePaymentStatus(appointment.id, event.target.value)}
                        aria-label={`Estado de pago de ${appointment.clientName}`}
                        className={`rounded-full border px-2.5 py-1.5 text-xs font-medium disabled:opacity-50 ${STATUS_STYLES[statusInfo.color]}`}
                      >
                        {Object.entries(PAYMENT_STATUSES).map(([value, info]) => (
                          <option key={value} value={value}>
                            {info.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    {showReminder && (
                      <td className="px-4 py-3">
                        {isCancelled ? (
                          <span className="text-xs text-muted">—</span>
                        ) : appointment.reminderSent ? (
                          <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                            <CheckCheck size={14} aria-hidden="true" />
                            Enviado
                          </span>
                        ) : (
                          <a
                            href={buildWhatsAppUrl(
                              appointment.clientPhone,
                              buildReminderMessage(appointment, service),
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => onSendReminder(appointment.id)}
                            aria-label={`Enviar recordatorio de WhatsApp a ${appointment.clientName}`}
                            className="flex items-center gap-1.5 rounded-full border border-rose-gold-deep/30 bg-rose-gold/10 px-3 py-1.5 text-xs font-medium text-rose-gold-deep transition hover:bg-rose-gold/20"
                          >
                            <Send size={12} aria-hidden="true" />
                            Enviar por WhatsApp
                          </a>
                        )}
                      </td>
                    )}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleNotes(appointment)}
                          aria-expanded={notesOpen}
                          aria-label={`Ver notas técnicas de ${appointment.clientName}`}
                          className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                            hasNotes
                              ? 'border-champagne/60 bg-champagne/10 text-plum'
                              : 'border-nude bg-white/60 text-muted hover:border-rose-gold-deep/40'
                          }`}
                        >
                          <NotebookPen size={12} aria-hidden="true" />
                          Notas
                          <ChevronDown
                            size={12}
                            className={`transition ${notesOpen ? 'rotate-180' : ''}`}
                            aria-hidden="true"
                          />
                        </button>
                        {!isCancelled && (
                          <button
                            type="button"
                            onClick={() => handleCancelAppointment(appointment.id, appointment.clientName)}
                            aria-label={`Cancelar turno de ${appointment.clientName}`}
                            className="flex items-center gap-1.5 rounded-full border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-100"
                          >
                            <Ban size={12} aria-hidden="true" />
                            Cancelar
                          </button>
                        )}
                        {isCancelled && (
                          <span className="flex items-center gap-1.5 text-xs font-medium text-red-500">
                            <Ban size={14} aria-hidden="true" />
                            Cancelado
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                  {notesOpen && (
                    <tr className="border-t border-nude/50 bg-nude/10">
                      <td colSpan={columnCount} className="px-4 py-3">
                        <label className="flex flex-col gap-1.5">
                          <span className="text-xs font-medium uppercase tracking-wide text-muted">
                            Notas técnicas del tratamiento (curvatura, mm, alergias, diseño de cejas...)
                          </span>
                          <textarea
                            rows={2}
                            value={draftNotes}
                            onChange={(event) => setDraftNotes(event.target.value)}
                            className="w-full resize-none rounded-xl border border-nude bg-white/70 px-3.5 py-2.5 text-sm text-plum placeholder:text-muted/50 focus:border-rose-gold-deep focus:outline-none"
                            placeholder="Ej: curvatura CC, 0.15mm, sin alergias conocidas."
                          />
                        </label>
                        <div className="mt-2 flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setOpenNotesId(null)}
                            className="rounded-full px-3.5 py-1.5 text-xs font-medium text-muted transition hover:text-plum"
                          >
                            Cancelar
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveNotes(appointment.id)}
                            className="rounded-full bg-gradient-to-r from-rose-gold to-champagne px-4 py-1.5 text-xs font-semibold text-obsidian transition hover:brightness-105"
                          >
                            Guardar notas
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        onClick={() => scrollByAmount(1)}
        disabled={!canScrollRight}
        aria-label="Ver columnas siguientes"
        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-nude/70 bg-white/60 text-plum/60 transition hover:border-rose-gold-deep/60 hover:text-plum disabled:pointer-events-none disabled:opacity-0"
      >
        <ChevronRight size={16} aria-hidden="true" />
      </button>
    </div>
  )
}
