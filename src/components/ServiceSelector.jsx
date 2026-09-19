import { ArrowRight } from 'lucide-react'
import { formatDuration, formatPrice } from '../data/utils'

export default function ServiceSelector({ services, selectedId, onSelect, onConfirm }) {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {services.map((service) => {
        const Icon = service.icon
        const isSelected = service.id === selectedId

        function handleKeyDown(event) {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            onSelect(service.id)
          }
        }

        return (
          <div
            key={service.id}
            id={`service-option-${service.id}`}
            role="button"
            tabIndex={0}
            aria-pressed={isSelected}
            onClick={() => onSelect(service.id)}
            onKeyDown={handleKeyDown}
            className={`group flex w-full cursor-pointer flex-col items-start gap-3 rounded-3xl border p-4 text-left shadow-xl shadow-rose-gold-deep/10 backdrop-blur-md transition sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)] ${
              isSelected
                ? 'border-rose-gold-deep bg-gradient-to-br from-rose-gold/20 to-champagne/15 shadow-2xl shadow-rose-gold-deep/20 ring-1 ring-rose-gold-deep/40'
                : 'border-nude/70 bg-white/55 hover:border-rose-gold/70 hover:bg-white/75'
            }`}
          >
            <div className="aspect-video w-full overflow-hidden rounded-2xl">
              <img
                src={service.image}
                alt={service.name}
                width={800}
                height={450}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
              />
            </div>

            <div className="flex w-full items-center justify-between">
              <span
                aria-hidden="true"
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  isSelected
                    ? 'bg-gradient-to-br from-rose-gold to-champagne text-obsidian'
                    : 'bg-nude/50 text-rose-gold-deep'
                }`}
              >
                <Icon size={18} />
              </span>
              <span className="rounded-full bg-plum/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-plum/70">
                {service.badge}
              </span>
            </div>
            <div>
              <p className="font-serif text-base font-semibold text-plum">
                {service.name}
              </p>
              <p className="mt-1 text-xs text-muted">{service.description}</p>
            </div>
            <div className="mt-auto flex w-full flex-col gap-1.5 border-t border-nude/70 pt-3">
              <span className="text-xl font-bold tracking-tight text-plum">
                {formatPrice(service.price)}
              </span>
              <span className="text-xs text-muted">
                Seña:{' '}
                <span className="font-semibold text-rose-gold-deep">
                  {formatPrice(service.deposit)}
                </span>
              </span>
              <span className="mt-0.5 inline-flex w-fit whitespace-nowrap rounded-full bg-nude/40 px-2.5 py-1 text-[11px] font-medium text-plum/70">
                {formatDuration(service.duration)}
              </span>
            </div>

            {isSelected && (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  onConfirm(service.id)
                }}
                className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-rose-gold to-champagne px-4 py-2.5 text-sm font-semibold text-obsidian transition hover:brightness-105"
              >
                Elegir y Continuar
                <ArrowRight size={15} aria-hidden="true" />
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
