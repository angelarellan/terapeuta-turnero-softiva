import { formatPrice } from '../data/utils'

export default function DepositBreakdown({ service }) {
  if (!service) return null

  const remaining = service.price - service.deposit

  return (
    <div className="mb-5 rounded-3xl border border-rose-gold/30 bg-gradient-to-br from-rose-gold/15 to-champagne/10 p-4">
      <div className="flex items-center justify-between text-sm text-plum/80">
        <span>Total del servicio</span>
        <span className="font-medium text-plum">{formatPrice(service.price)}</span>
      </div>
      <div className="mt-2 flex items-center justify-between text-sm">
        <span className="font-semibold text-plum">Seña a pagar ahora</span>
        <span className="text-lg font-bold text-rose-gold-deep">
          {formatPrice(service.deposit)}
        </span>
      </div>
      <div className="mt-2 flex items-center justify-between border-t border-nude/70 pt-2 text-xs text-muted">
        <span>Resta abonar en el turno</span>
        <span>{formatPrice(remaining)}</span>
      </div>
    </div>
  )
}
