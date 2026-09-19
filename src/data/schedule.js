// Agenda con franja partida (mañana y tarde) y bloqueo de horarios según la
// duración real de cada servicio, no un slot fijo de 30 minutos para todos.

export const BUSINESS_HOURS = [
  { start: '08:00', end: '12:00' },
  { start: '16:00', end: '20:00' },
]

const SLOT_STEP_MINUTES = 30

export function timeToMinutes(time) {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

export function minutesToTime(totalMinutes) {
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

// Encuentra el turno (mañana/tarde) al que pertenece un horario de inicio,
// en minutos. Devuelve null si cae fuera de la atención (ej. 12:00 a 16:00).
function findShift(startMinutes) {
  return (
    BUSINESS_HOURS.map((shift) => ({
      start: timeToMinutes(shift.start),
      end: timeToMinutes(shift.end),
    })).find((shift) => startMinutes >= shift.start && startMinutes < shift.end) ?? null
  )
}

// Todos los horarios de inicio posibles cada 30 min dentro de ambas franjas
// (ej. 08:00 a 11:30 y 16:00 a 19:30). Reemplaza la lista fija de antes:
// entre las 12:00 y las 16:00 directamente no se genera ningún horario.
export const TIME_SLOTS = BUSINESS_HOURS.flatMap((shift) => {
  const start = timeToMinutes(shift.start)
  const end = timeToMinutes(shift.end)
  const slots = []
  for (let m = start; m < end; m += SLOT_STEP_MINUTES) {
    slots.push(minutesToTime(m))
  }
  return slots
})

// Arma los intervalos [inicio, fin) ocupados a partir de una lista de
// { time, duration } (turnos existentes o los BOOKED_SLOTS de ejemplo).
export function buildBusyIntervals(entries) {
  return entries.map(({ time, duration }) => {
    const start = timeToMinutes(time)
    return { start, end: start + duration }
  })
}

// ¿Se puede empezar un servicio de `durationMinutes` a las `time`? Tiene que
// entrar completo antes de que cierre esa franja (mañana o tarde) y no
// puede pisar ningún intervalo ya ocupado.
export function isSlotBookable(time, durationMinutes, busyIntervals) {
  const start = timeToMinutes(time)
  const shift = findShift(start)
  if (!shift) return false

  const end = start + durationMinutes
  if (end > shift.end) return false

  return !busyIntervals.some((busy) => start < busy.end && end > busy.start)
}

// Devuelve, de TIME_SLOTS, cuáles quedan bloqueados para un servicio de esta
// duración dados los intervalos ya ocupados ese día para esa especialista.
export function getBlockedSlots(durationMinutes, busyIntervals) {
  return TIME_SLOTS.filter((time) => !isSlotBookable(time, durationMinutes, busyIntervals))
}
