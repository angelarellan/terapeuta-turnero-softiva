import { ArrowRight } from 'lucide-react'
import { formatDuration, formatPrice } from '../data/utils'

export default function ServicesShowcase({ services, onSelectService }) {
  return (
    <section id="servicios" className="scroll-mt-24 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-8 max-w-xl text-center">
          <h2 className="font-serif text-3xl font-bold text-plum sm:text-4xl">
            Nuestros Servicios
          </h2>
          <p className="mt-2 text-base text-muted sm:text-lg">
            Tratamiento de pestañas y cejas hechos a medida.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <div
                key={service.id}
                className="group flex w-full flex-col items-start gap-3 rounded-3xl border border-nude/70 bg-white/55 p-5 text-left shadow-xl shadow-rose-gold-deep/10 backdrop-blur-md sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)]"
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
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-nude/50 text-rose-gold-deep"
                  >
                    <Icon size={22} />
                  </span>
                  <span className="rounded-full bg-plum/5 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-plum/70">
                    {service.badge}
                  </span>
                </div>
                <div>
                  <p className="font-serif text-lg font-semibold text-plum">
                    {service.name}
                  </p>
                  <p className="mt-1 text-sm text-muted">{service.description}</p>
                </div>
                <div className="mt-auto flex w-full flex-col gap-1.5 border-t border-nude/70 pt-3">
                  <span className="text-2xl font-bold tracking-tight text-plum">
                    {formatPrice(service.price)}
                  </span>
                  <span className="inline-flex w-fit whitespace-nowrap rounded-full bg-nude/40 px-2.5 py-1 text-xs font-medium text-plum/70">
                    {formatDuration(service.duration)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectService(service.id)}
                  className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-rose-gold to-champagne px-4 py-2.5 text-base font-semibold text-obsidian transition hover:brightness-105"
                >
                  Reservar este servicio
                  <ArrowRight size={15} aria-hidden="true" />
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
