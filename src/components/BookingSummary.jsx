import { User, CalendarDays, Clock, Wallet } from 'lucide-react'
import { formatPrice, formatDateLong } from '../data/utils'
import { minutesToTime, timeToMinutes } from '../data/schedule'

export default function BookingSummary({ service, barber, date, time }) {
  // barber y date ya vienen con un valor por defecto (única especialista y
  // la primera fecha disponible) antes de que el cliente elija nada, así
  // que solo mostrar el resumen si falta ALGO nunca ocultaba nada en la
  // práctica. El dato que de verdad marca "arrancó a reservar" es el
  // servicio.
  if (!service) return null

  return (
    <div className="rounded-3xl border border-nude/70 bg-white/55 p-5 shadow-xl shadow-rose-gold-deep/10 backdrop-blur-md">
      <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted">
        Resumen de tu turno
      </p>
      <ul className="flex flex-col gap-2.5 text-sm">
        {service && (
          <>
            <li className="flex items-center justify-between gap-2 text-plum/80">
              <span className="flex items-center gap-2">
                <service.icon size={14} className="text-rose-gold-deep" aria-hidden="true" />
                {service.name}
              </span>
              <span className="font-semibold text-plum">
                {formatPrice(service.price)}
              </span>
            </li>
            <li className="flex items-center justify-between gap-2 text-plum/80">
              <span className="flex items-center gap-2">
                <Wallet size={14} className="text-rose-gold-deep" aria-hidden="true" />
                Seña a pagar
              </span>
              <span className="font-semibold text-rose-gold-deep">
                {formatPrice(service.deposit)}
              </span>
            </li>
          </>
        )}
        {barber && (
          <li className="flex items-center gap-2 text-plum/80">
            <User size={14} className="text-rose-gold-deep" aria-hidden="true" />
            {barber.name}
          </li>
        )}
        {date && (
          <li className="flex items-center gap-2 capitalize text-plum/80">
            <CalendarDays size={14} className="text-rose-gold-deep" aria-hidden="true" />
            {formatDateLong(date)}
          </li>
        )}
        {time && (
          <li className="flex items-center gap-2 text-plum/80">
            <Clock size={14} className="text-rose-gold-deep" aria-hidden="true" />
            {time} a {minutesToTime(timeToMinutes(time) + service.duration)} hs
          </li>
        )}
      </ul>
    </div>
  )
}
