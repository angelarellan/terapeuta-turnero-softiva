export function formatPrice(value) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value)
}

// Etiqueta de duración para las tarjetas de servicio: en minutos si dura
// menos de una hora, y en horas ("1h", "2h30") a partir de ahí.
export function formatDuration(minutes) {
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest === 0 ? `${hours}h` : `${hours}h${rest}`
}

export function formatDateLong(dateStr) {
  const date = new Date(`${dateStr}T00:00:00`)
  return new Intl.DateTimeFormat('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date)
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

// "16/09" — fecha corta para encabezados compactos (ej. rango de semana).
// Se arma a mano en vez de con Intl.DateTimeFormat: sin un año en las
// opciones, "es-AR" no rellena el mes con cero a la izquierda (da "16/9"
// en vez de "16/09"), así que esto es más confiable.
export function formatDateShort(dateStr) {
  const [, month, day] = dateStr.split('-')
  return `${day}/${month}`
}

// Pasa a minúsculas y saca tildes/diacríticos, para comparar texto ingresado
// por el usuario ("gomez") contra datos acentuados ("Gómez") sin distinción.
export function normalizeText(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function pad(n) {
  return String(n).padStart(2, '0')
}

export function getMonthLabel(year, month) {
  const monthName = new Intl.DateTimeFormat('es-AR', { month: 'long' }).format(
    new Date(year, month, 1),
  )
  return `${monthName} ${year}`
}

// Devuelve una grilla de semanas (lunes a domingo) para el mes dado, con
// `null` en los días de relleno antes del 1° y después del último día.
export function getMonthCells(year, month) {
  const firstDay = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const startOffset = (firstDay.getDay() + 6) % 7
  const cells = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ day, iso: `${year}-${pad(month + 1)}-${pad(day)}` })
  }
  return cells
}

function toISO(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

// Devuelve el rango [desde, hasta] (ISO, inclusive) para los filtros rápidos
// del historial: hoy, esta semana (lunes a domingo) o este mes.
export function getRangeBounds(range) {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  if (range === 'today') {
    const iso = toISO(today)
    return { from: iso, to: iso }
  }

  if (range === 'week') {
    const weekday = (today.getDay() + 6) % 7 // 0 = lunes
    const monday = new Date(today)
    monday.setDate(today.getDate() - weekday)
    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)
    return { from: toISO(monday), to: toISO(sunday) }
  }

  if (range === 'month') {
    const first = new Date(today.getFullYear(), today.getMonth(), 1)
    const last = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    return { from: toISO(first), to: toISO(last) }
  }

  return null
}

// Semana (lunes a domingo) que contiene la fecha dada — a diferencia de
// getRangeBounds("week"), que siempre es relativo a hoy, esta toma como
// ancla la fecha elegida en el datepicker del admin.
export function getWeekBoundsForDate(dateIso) {
  const date = new Date(`${dateIso}T00:00:00`)
  const weekday = (date.getDay() + 6) % 7 // 0 = lunes
  const monday = new Date(date)
  monday.setDate(date.getDate() - weekday)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  return { from: toISO(monday), to: toISO(sunday) }
}

// Todas las fechas ISO (lunes a domingo, en orden) de la semana que
// contiene `dateIso`.
export function getWeekDates(dateIso) {
  const { from } = getWeekBoundsForDate(dateIso)
  const monday = new Date(`${from}T00:00:00`)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return toISO(d)
  })
}

// Mes calendario que contiene la fecha dada.
export function getMonthBoundsForDate(dateIso) {
  const [year, month] = dateIso.split('-').map(Number)
  const first = new Date(year, month - 1, 1)
  const last = new Date(year, month, 0)
  return { from: toISO(first), to: toISO(last) }
}

// Devuelve todas las fechas ISO entre `fromIso` y `toIso`, incluidas ambas
// puntas. Se usa para expandir un rango de vacaciones a días individuales.
export function expandDateRange(fromIso, toIso) {
  const start = new Date(`${fromIso}T00:00:00`)
  const end = new Date(`${toIso}T00:00:00`)
  const dates = []
  const cursor = new Date(start)
  while (cursor <= end) {
    dates.push(toISO(cursor))
    cursor.setDate(cursor.getDate() + 1)
  }
  return dates
}

// Agrupa fechas ISO consecutivas en rangos {from, to} para mostrarlas de
// forma compacta en vez de un chip por día ("16 al 20 de dic." en vez de 5
// chips sueltos).
export function groupConsecutiveDates(isoDates) {
  const sorted = [...new Set(isoDates)].sort()
  const groups = []
  for (const iso of sorted) {
    const last = groups[groups.length - 1]
    if (last) {
      const nextDay = new Date(`${last.to}T00:00:00`)
      nextDay.setDate(nextDay.getDate() + 1)
      if (toISO(nextDay) === iso) {
        last.to = iso
        continue
      }
    }
    groups.push({ from: iso, to: iso })
  }
  return groups
}

// Busca la primera fecha disponible (no bloqueada) a partir de hoy, para
// no arrancar el flujo de reserva mostrando un día de vacaciones.
export function getFirstAvailableDate(blockedDates, maxDaysAhead = 365) {
  const blocked = new Set(blockedDates)
  const cursor = new Date()
  cursor.setHours(0, 0, 0, 0)
  for (let i = 0; i < maxDaysAhead; i++) {
    const iso = toISO(cursor)
    if (!blocked.has(iso)) return iso
    cursor.setDate(cursor.getDate() + 1)
  }
  return todayISO()
}

// Arma y dispara la descarga de un archivo CSV en el navegador.
export function downloadCSV(filename, rows) {
  const csvContent = rows
    .map((row) =>
      row
        .map((cell) => {
          const value = String(cell ?? '')
          return /[",\n;]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value
        })
        .join(';'),
    )
    .join('\n')

  const blob = new Blob([`﻿${csvContent}`], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
