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
            className={`flex flex-col items-center gap-3 rounded-3xl border p-5 text-center shadow-xl shadow-sage-deep/10 backdrop-blur-md transition ${
              isSelected
                ? 'border-sage-deep bg-gradient-to-br from-sage/20 to-gold/15 shadow-2xl shadow-sage-deep/20 ring-1 ring-sage-deep/40'
                : 'border-beige/70 bg-white/55 hover:border-sage/70 hover:bg-white/75'
            }`}
          >
            <span
              className={`flex h-16 w-16 items-center justify-center overflow-hidden rounded-full ring-2 transition ${
                isSelected ? 'ring-sage-deep' : 'ring-beige'
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
              <p className="font-serif text-base font-semibold text-ink">
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
