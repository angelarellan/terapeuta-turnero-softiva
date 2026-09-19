import { getBarberAvatar } from '../data/avatars'

export default function BarberSelector({ barbers, selectedId, onSelect }) {
  if (barbers.length === 0) {
    return (
      <p className="text-sm text-muted">
        No hay especialistas disponibles en este momento.
      </p>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {barbers.map((barber) => {
        const isSelected = barber.id === selectedId
        return (
          <button
            key={barber.id}
            type="button"
            onClick={() => onSelect(barber.id)}
            className={`flex flex-col items-center gap-3 rounded-3xl border p-5 text-center shadow-xl shadow-rose-gold-deep/10 backdrop-blur-md transition ${
              isSelected
                ? 'border-rose-gold-deep bg-gradient-to-br from-rose-gold/20 to-champagne/15 shadow-2xl shadow-rose-gold-deep/20 ring-1 ring-rose-gold-deep/40'
                : 'border-nude/70 bg-white/55 hover:border-rose-gold/70 hover:bg-white/75'
            }`}
          >
            <span
              className={`flex h-16 w-16 items-center justify-center overflow-hidden rounded-full ring-2 transition ${
                isSelected ? 'ring-rose-gold-deep' : 'ring-nude'
              }`}
            >
              <img
                src={getBarberAvatar(barber.id)}
                alt=""
                aria-hidden="true"
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            </span>
            <div>
              <p className="font-serif text-base font-semibold text-plum">
                {barber.name}
              </p>
              <p className="mt-1 text-xs text-muted">{barber.role}</p>
            </div>
          </button>
        )
      })}
    </div>
  )
}
