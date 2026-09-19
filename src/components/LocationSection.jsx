import { MapPin, ExternalLink } from 'lucide-react'
import { STUDIO_INFO } from '../data/mockData'

export default function LocationSection() {
  return (
    <section id="ubicacion" className="scroll-mt-24 px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 rounded-3xl border border-nude/70 bg-gradient-to-br from-rose-gold/15 to-champagne/10 p-8 text-center shadow-2xl shadow-rose-gold-deep/10 backdrop-blur-md">
        <span
          aria-hidden="true"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white/70 text-rose-gold-deep"
        >
          <MapPin size={22} />
        </span>
        <div>
          <h2 className="font-serif text-2xl font-bold text-plum sm:text-3xl">Ubicación</h2>
          <p className="mt-1 text-base text-muted">{STUDIO_INFO.addressLine}</p>
        </div>

        <div className="w-full overflow-hidden rounded-2xl border border-nude/70 shadow-lg shadow-rose-gold-deep/10">
          <iframe
            title={`Mapa de ubicación de ${STUDIO_INFO.name}`}
            src={STUDIO_INFO.mapsEmbedUrl}
            width="100%"
            height="280"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <a
          href={STUDIO_INFO.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-gold to-champagne px-5 py-2.5 text-base font-semibold text-obsidian transition hover:brightness-105"
        >
          Ver ubicación en Google Maps
          <ExternalLink size={17} aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}
