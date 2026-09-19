import { STUDIO_INFO, PAYMENT_STATUSES } from './mockData'
import { formatDateLong, formatPrice } from './utils'
import { minutesToTime, timeToMinutes } from './schedule'

// Normaliza un teléfono ingresado en cualquier formato ("351 555 0142",
// "+54 9 351 555-0142", etc.) al formato que espera wa.me: solo dígitos,
// con el código de país argentino (54) y el prefijo de celular (9) si no
// vinieran ya incluidos. Es un mejor esfuerzo, no una validación estricta:
// como el link se abre en el momento y quien lo manda ve el resultado, un
// número mal tipeado por la clienta se nota enseguida.
export function normalizeArgPhone(rawPhone) {
  const digits = String(rawPhone ?? '').replace(/\D/g, '')
  if (!digits) return ''
  if (digits.startsWith('54')) return digits
  return `549${digits.replace(/^0/, '')}`
}

export function buildWhatsAppUrl(rawPhone, message) {
  const phone = normalizeArgPhone(rawPhone)
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}

export function buildOwnerNotificationMessage(booking) {
  const statusLabel = PAYMENT_STATUSES[booking.paymentStatus]?.label ?? 'Pendiente de Seña'
  const endTime = minutesToTime(timeToMinutes(booking.time) + booking.service.duration)
  return [
    '💅 ¡Nuevo Turno Reservado!',
    `• Cliente: ${booking.clientName} (${booking.clientPhone})`,
    `• Servicio: ${booking.service.name}`,
    `• Fecha y Hora: ${formatDateLong(booking.date)} - ${booking.time} a ${endTime} hs`,
    `• Especialista: ${booking.barber.name}`,
    `• Seña abonada: ${formatPrice(booking.service.deposit)}`,
    `• Estado: ${statusLabel}`,
  ].join('\n')
}

export function buildReminderMessage(appointment, service) {
  const timeRange = service
    ? `${appointment.time} a ${minutesToTime(timeToMinutes(appointment.time) + service.duration)}`
    : appointment.time
  return [
    `🌸 ¡Hola ${appointment.clientName.split(' ')[0]}! Te recordamos tu turno en ${STUDIO_INFO.name}.`,
    `• Servicio: ${service?.name ?? ''}`,
    `• Fecha y Hora: ${formatDateLong(appointment.date)} - ${timeRange} hs`,
    `• Ubicación: ${STUDIO_INFO.addressLine}`,
    '¡Te esperamos!',
  ].join('\n')
}
