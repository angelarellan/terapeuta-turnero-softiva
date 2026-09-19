import { useState } from 'react'
import { CalendarOff, Plus, Trash2 } from 'lucide-react'
import { expandDateRange, formatDateLong, groupConsecutiveDates, todayISO } from '../data/utils'

export default function BlockedDatesManager({ blockedDates, onAddDates, onRemoveDates }) {
  const today = todayISO()
  const [singleDate, setSingleDate] = useState('')
  const [rangeFrom, setRangeFrom] = useState('')
  const [rangeTo, setRangeTo] = useState('')

  const groups = groupConsecutiveDates(blockedDates)

  function handleAddSingle(event) {
    event.preventDefault()
    if (!singleDate) return
    onAddDates([singleDate])
    setSingleDate('')
  }

  function handleAddRange(event) {
    event.preventDefault()
    if (!rangeFrom || !rangeTo || rangeFrom > rangeTo) return
    onAddDates(expandDateRange(rangeFrom, rangeTo))
    setRangeFrom('')
    setRangeTo('')
  }

  function handleRemoveGroup(group) {
    onRemoveDates(expandDateRange(group.from, group.to))
  }

  return (
    <div className="mt-8">
      <div className="mb-4">
        <h2 className="font-serif text-lg font-semibold text-plum">
          Vacaciones y Días Bloqueados
        </h2>
        <p className="mt-1 text-sm text-muted">
          Los días que bloquees acá quedan deshabilitados en el calendario público de
          reservas.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <form
          onSubmit={handleAddSingle}
          className="flex flex-col gap-3 rounded-3xl border border-nude/70 bg-white/55 p-4 shadow-lg shadow-rose-gold-deep/10 backdrop-blur-md"
        >
          <span className="text-xs font-medium uppercase tracking-wide text-muted">
            Bloquear un día puntual
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="date"
              min={today}
              value={singleDate}
              onChange={(event) => setSingleDate(event.target.value)}
              required
              className="rounded-xl border border-nude bg-white/70 px-3.5 py-2.5 text-sm text-plum focus:border-rose-gold-deep focus:outline-none"
            />
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-rose-gold to-champagne px-4 py-2 text-sm font-semibold text-obsidian transition hover:brightness-105"
            >
              <Plus size={15} aria-hidden="true" />
              Bloquear
            </button>
          </div>
        </form>

        <form
          onSubmit={handleAddRange}
          className="flex flex-col gap-3 rounded-3xl border border-nude/70 bg-white/55 p-4 shadow-lg shadow-rose-gold-deep/10 backdrop-blur-md"
        >
          <span className="text-xs font-medium uppercase tracking-wide text-muted">
            Bloquear un rango (ej. vacaciones)
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="date"
              min={today}
              value={rangeFrom}
              onChange={(event) => setRangeFrom(event.target.value)}
              required
              aria-label="Desde"
              className="rounded-xl border border-nude bg-white/70 px-3.5 py-2.5 text-sm text-plum focus:border-rose-gold-deep focus:outline-none"
            />
            <span className="text-sm text-muted">a</span>
            <input
              type="date"
              min={rangeFrom || today}
              value={rangeTo}
              onChange={(event) => setRangeTo(event.target.value)}
              required
              aria-label="Hasta"
              className="rounded-xl border border-nude bg-white/70 px-3.5 py-2.5 text-sm text-plum focus:border-rose-gold-deep focus:outline-none"
            />
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-rose-gold to-champagne px-4 py-2 text-sm font-semibold text-obsidian transition hover:brightness-105"
            >
              <Plus size={15} aria-hidden="true" />
              Bloquear rango
            </button>
          </div>
        </form>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {groups.length === 0 && (
          <p className="rounded-3xl border border-nude/70 bg-white/55 p-4 text-sm text-muted">
            No hay días bloqueados. El calendario público está totalmente disponible.
          </p>
        )}
        {groups.map((group) => (
          <div
            key={group.from}
            className="flex flex-col gap-2 rounded-3xl border border-nude/70 bg-white/55 p-4 shadow-lg shadow-rose-gold-deep/10 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-nude/50 text-rose-gold-deep"
              >
                <CalendarOff size={16} />
              </span>
              <p className="text-sm font-medium capitalize text-plum">
                {group.from === group.to
                  ? formatDateLong(group.from)
                  : `${formatDateLong(group.from)} — ${formatDateLong(group.to)}`}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleRemoveGroup(group)}
              aria-label={`Desbloquear ${formatDateLong(group.from)}`}
              className="flex items-center gap-1.5 self-start rounded-full border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-100 sm:self-auto"
            >
              <Trash2 size={12} aria-hidden="true" />
              Desbloquear
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
