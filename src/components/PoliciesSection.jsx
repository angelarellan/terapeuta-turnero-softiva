import {
  CalendarCheck,
  CreditCard,
  Ban,
  ShieldCheck,
  Clock,
  Lock,
  MessageCircleWarning,
} from 'lucide-react'
import { STUDIO_INFO } from '../data/mockData'

const POLICIES = [
  {
    icon: CreditCard,
    title: 'Medios de pago',
    text: 'Aceptamos todos los medios de pago. Pagos con link, débito o crédito tienen un recargo del 20%. Transferencia sin recargo.',
  },
  {
    icon: CalendarCheck,
    title: 'Reserva y seña',
    text: 'Cada turno se reserva abonando la seña correspondiente a la sesión elegida (indicada en cada servicio). Debe abonarse dentro de las 24 hs de reservado. La seña no es reembolsable; el resto se abona en efectivo el día de la sesión.',
  },
  {
    icon: Ban,
    title: 'Cancelación y reprogramación',
    text: 'La sesión puede reprogramarse sin perder la seña solo si avisás con más de 48 hs de anticipación (sujeto a disponibilidad). Fuera de ese plazo la seña se pierde y deberá abonarse una nueva para reservar otro turno.',
  },
  {
    icon: Lock,
    title: 'Confidencialidad',
    text: 'Todo lo compartido durante la sesión es estrictamente confidencial, en el marco del secreto profesional.',
  },
  {
    icon: ShieldCheck,
    title: 'Modalidad',
    text: 'Las sesiones son presenciales u online (teleconsulta), según el servicio elegido. La sesión online se realiza por videollamada desde un enlace que se envía antes del turno.',
  },
  {
    icon: Clock,
    title: 'Horario de llegada',
    text: 'La tolerancia máxima es de 10 minutos. Pasado ese tiempo se descuenta del tiempo total de la sesión.',
  },
  {
    icon: MessageCircleWarning,
    title: 'Confirmación por WhatsApp',
    text: 'Una vez abonada la seña, enviá el comprobante por WhatsApp para confirmar tu turno.',
  },
]

export default function PoliciesSection() {
  return (
    <section id="politicas" className="scroll-mt-24 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <h2 className="font-serif text-3xl font-bold text-ink sm:text-4xl">
            Políticas de Turno
          </h2>
          <p className="mt-2 text-base text-muted sm:text-lg">
            Gracias por confiar en {STUDIO_INFO.founder} — {STUDIO_INFO.name}. Por favor
            leé esto antes de reservar.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {POLICIES.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="flex items-start gap-4 rounded-3xl border border-beige/70 bg-white/55 p-6 shadow-xl shadow-sage-deep/10 backdrop-blur-md"
            >
              <span
                aria-hidden="true"
                className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-beige/50 text-sage-deep"
              >
                <Icon size={20} />
              </span>
              <div>
                <p className="font-serif text-lg font-semibold text-ink">{title}</p>
                <p className="mt-1.5 text-base text-muted">{text}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-base text-muted">
          Si no aceptás las políticas establecidas, por favor no reserves un turno. ¡Te
          esperamos! 🤗
        </p>
      </div>
    </section>
  )
}
