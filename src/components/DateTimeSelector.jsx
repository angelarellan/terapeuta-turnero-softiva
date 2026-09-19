import { CalendarOff } from 'lucide-react'
import Calendar from './Calendar'

export default function DateTimeSelector({
  timeSlots,
  bookedSlots,
  selectedDate,
  selectedTime,
  blockedDates = [],
  isDateBlocked = false,
  onSelectDate,
  onSelectTime,
}) {
  return (
    <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
      <div className="xl:w-full xl:max-w-xs xl:flex-shrink-0">
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted">
          Elegí una fecha
        </p>
        <Calendar
          selectedDate={selectedDate}
          onSelectDate={onSelectDate}
          blockedDates={blockedDates}
        />
      </div>

      <div className="xl:w-full xl:max-w-xs xl:flex-shrink-0">
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted">
          Elegí un horario
        </p>
        {isDateBlocked ? (
          <div className="flex items-start gap-3 rounded-2xl border border-beige/70 bg-beige/20 p-4 text-sm text-muted">
            <CalendarOff size={18} className="mt-0.5 flex-shrink-0 text-sage-deep" aria-hidden="true" />
            <span>El estudio no atiende ese día. Elegí otra fecha en el calendario.</span>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 xl:grid-cols-3">
            {timeSlots.map((slot) => {
              const isBooked = bookedSlots.includes(slot)
              const isSelected = slot === selectedTime
              return (
                <button
                  key={slot}
                  type="button"
                  disabled={isBooked}
                  onClick={() => onSelectTime(slot)}
                  className={`rounded-lg border px-2 py-2 text-sm font-medium transition ${
                    isBooked
                      ? 'cursor-not-allowed border-beige/40 bg-beige/10 text-ink/25 line-through'
                      : isSelected
                        ? 'border-transparent bg-gradient-to-br from-sage to-gold text-charcoal'
                        : 'border-beige/70 bg-white/55 text-ink/80 hover:border-sage-deep/60'
                  }`}
                >
                  {slot}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
