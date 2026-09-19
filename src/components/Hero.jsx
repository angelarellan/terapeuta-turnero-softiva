import { MapPin, Eye, Waves, Feather } from 'lucide-react'

const BADGES = [
  { label: 'Pestañas', icon: Eye },
  { label: 'Cejas', icon: Feather },
  { label: 'Lifting', icon: Waves },
]

export default function Hero() {
  return (
    <section id="inicio" className="scroll-mt-24 border-b border-nude/60 px-4 py-10 text-center sm:px-6 sm:py-14">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-3">
        <h1 className="font-serif text-3xl font-extrabold tracking-tight text-plum sm:text-4xl lg:whitespace-nowrap">
          VR Beauty Lash<span className="hidden sm:inline"> — </span>
          <br className="sm:hidden" />
          Cejas & Pestañas
        </h1>
        <p className="flex items-center gap-1.5 text-base text-muted">
          <MapPin size={17} aria-hidden="true" />
          Argüello, Córdoba, Argentina
        </p>
        <p className="max-w-xl text-lg text-plum/70 sm:text-xl">
          Reservá tu turno online en menos de un minuto. Elegí tu tratamiento y
          el horario que más te convenga.
        </p>

        <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
          {BADGES.map(({ label, icon: Icon }) => (
            <span
              key={label}
              className="flex items-center gap-2 rounded-full border border-nude/70 bg-white/60 px-4 py-2 text-sm font-medium text-plum/75 shadow-sm shadow-rose-gold-deep/10 backdrop-blur-md sm:text-base"
            >
              <Icon size={16} className="text-rose-gold-deep" aria-hidden="true" />
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
