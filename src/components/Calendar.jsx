import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { formatDateLong, getMonthCells, getMonthLabel, todayISO } from '../data/utils'

const WEEKDAY_LABELS = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do']

export default function Calendar({ selectedDate, onSelectDate, blockedDates = [] }) {
  const today = todayISO()
  const [todayYear, todayMonth, todayDay] = today.split('-').map(Number)
  const [refIso] = useState(selectedDate || today)
  const [refYear, refMonth] = refIso.split('-').map(Number)
  const [viewYear, setViewYear] = useState(refYear)
  const [viewMonth, setViewMonth] = useState(refMonth - 1)

  const isAtCurrentMonth = viewYear === todayYear && viewMonth === todayMonth - 1

  function goToPrevMonth() {
    if (isAtCurrentMonth) return
    if (viewMonth === 0) {
      setViewYear((y) => y - 1)
      setViewMonth(11)
    } else {
      setViewMonth((m) => m - 1)
    }
  }

  function goToNextMonth() {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1)
      setViewMonth(0)
    } else {
      setViewMonth((m) => m + 1)
    }
  }

  const cells = getMonthCells(viewYear, viewMonth)
  const todayIso = `${todayYear}-${String(todayMonth).padStart(2, '0')}-${String(todayDay).padStart(2, '0')}`

  return (
    <div className="w-full rounded-3xl border border-nude/70 bg-white/55 p-4 shadow-xl shadow-rose-gold-deep/10 backdrop-blur-md xl:max-w-xs">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={goToPrevMonth}
          disabled={isAtCurrentMonth}
          aria-label="Mes anterior"
          className="flex h-8 w-8 items-center justify-center rounded-full text-plum/70 transition hover:bg-nude/40 hover:text-plum disabled:pointer-events-none disabled:opacity-0"
        >
          <ChevronLeft size={16} aria-hidden="true" />
        </button>
        <p aria-live="polite" className="text-sm font-semibold capitalize text-plum">
          {getMonthLabel(viewYear, viewMonth)}
        </p>
        <button
          type="button"
          onClick={goToNextMonth}
          aria-label="Mes siguiente"
          className="flex h-8 w-8 items-center justify-center rounded-full text-plum/70 transition hover:bg-nude/40 hover:text-plum"
        >
          <ChevronRight size={16} aria-hidden="true" />
        </button>
      </div>

      <div
        aria-hidden="true"
        className="mt-3 grid grid-cols-7 gap-1 text-center text-[11px] font-medium uppercase text-muted"
      >
        {WEEKDAY_LABELS.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((cell, index) => {
          if (!cell) return <span key={`empty-${index}`} aria-hidden="true" />
          const isPast = cell.iso < todayIso
          const isBlocked = blockedDates.includes(cell.iso)
          const isDisabled = isPast || isBlocked
          const isSelected = cell.iso === selectedDate
          const isToday = cell.iso === todayIso
          return (
            <button
              key={cell.iso}
              type="button"
              disabled={isDisabled}
              onClick={() => onSelectDate(cell.iso)}
              aria-current={isToday ? 'date' : undefined}
              aria-label={
                isBlocked
                  ? `${formatDateLong(cell.iso)} (no disponible)`
                  : formatDateLong(cell.iso)
              }
              className={`aspect-square rounded-lg text-sm font-medium transition ${
                isSelected
                  ? 'bg-gradient-to-br from-rose-gold to-champagne text-obsidian'
                  : isBlocked
                    ? 'cursor-not-allowed text-plum/20 line-through'
                    : isPast
                      ? 'cursor-not-allowed text-plum/20'
                      : `text-plum/75 hover:bg-nude/40 ${isToday ? 'ring-1 ring-inset ring-rose-gold-deep/50' : ''}`
              }`}
            >
              {cell.day}
            </button>
          )
        })}
      </div>
    </div>
  )
}
