import { CheckCircle2, MessageCircle, RotateCcw } from 'lucide-react'
import { formatDateLong, formatPrice } from '../data/utils'
import { minutesToTime, timeToMinutes } from '../data/schedule'
import { buildOwnerNotificationMessage, buildWhatsAppUrl } from '../data/whatsapp'
import { STUDIO_INFO } from '../data/mockData'

export default function SuccessScreen({ booking, onReset }) {
  const { service, barber, date, time, clientName } = booking

  const ownerWhatsAppUrl = buildWhatsAppUrl(
    STUDIO_INFO.whatsappNumber,
    buildOwnerNotificationMessage(booking),
  )

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-6 px-4 py-10 text-center sm:px-6">
      <span
        aria-hidden="true"
        className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-500"
      >
        <CheckCircle2 size={34} />
      </span>
      <div>
        <h2 className="font-serif text-2xl font-bold text-plum">
          ¡Reserva confirmada, {clientName.split(' ')[0]}!
        </h2>
        <p className="mt-2 text-sm text-muted">
          Tu seña fue acreditada con Mercado Pago. Un último paso para avisarle
          a Vicky.
        </p>
      </div>

      <div className="w-full rounded-3xl border border-nude/70 bg-white/60 p-5 text-left text-sm text-plum/80 shadow-xl shadow-rose-gold-deep/10 backdrop-blur-md">
        <div className="flex justify-between border-b border-nude/70 pb-2.5">
          <span className="text-muted">Servicio</span>
          <span className="font-medium text-plum">
            {service.name} · {formatPrice(service.price)}
          </span>
        </div>
        <div className="flex justify-between border-b border-nude/70 py-2.5">
          <span className="text-muted">Especialista</span>
          <span className="font-medium text-plum">{barber.name}</span>
        </div>
        <div className="flex justify-between border-b border-nude/70 py-2.5">
          <span className="text-muted">Fecha</span>
          <span className="font-medium capitalize text-plum">
            {formatDateLong(date)}
          </span>
        </div>
        <div className="flex justify-between border-b border-nude/70 py-2.5">
          <span className="text-muted">Horario</span>
          <span className="font-medium text-plum">
            {time} a {minutesToTime(timeToMinutes(time) + service.duration)} hs
          </span>
        </div>
        <div className="flex justify-between pt-2.5">
          <span className="text-muted">Seña abonada (Mercado Pago)</span>
          <span className="font-medium text-rose-gold-deep">
            {formatPrice(service.deposit)}
          </span>
        </div>
      </div>

      <div className="flex w-full flex-col items-center gap-3 rounded-3xl border border-emerald-200 bg-emerald-50 p-5">
        <a
          href={ownerWhatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full max-w-xs items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-rose-gold to-champagne px-5 py-2.5 text-sm font-semibold text-obsidian shadow-md shadow-rose-gold-deep/20 transition hover:brightness-105"
        >
          <MessageCircle size={16} aria-hidden="true" />
          Enviar comprobante y notificar a Vicky
        </a>
        <p className="text-xs text-emerald-700">
          Presioná el botón para enviar tu confirmación directamente al chat de
          Vicky.
        </p>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="flex items-center gap-2 rounded-full border border-nude px-5 py-2.5 text-sm font-medium text-plum/80 transition hover:border-rose-gold-deep hover:text-plum"
      >
        <RotateCcw size={15} aria-hidden="true" />
        Agendar otro turno
      </button>
    </div>
  )
}
