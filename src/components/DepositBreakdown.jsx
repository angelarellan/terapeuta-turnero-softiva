import { formatPrice } from '../data/utils'

export default function DepositBreakdown({ service }) {
  if (!service) return null

  const remaining = service.price - service.deposit

  return (
    <div className="mb-5 rounded-3xl border border-sage/30 bg-gradient-to-br from-sage/15 to-gold/10 p-4">
      <div className="flex items-center justify-between text-sm text-ink/80">
        <span>Total del servicio</span>
        <span className="font-medium text-ink">{formatPrice(service.price)}</span>
      </div>
      <div className="mt-2 flex items-center justify-between text-sm">
        <span className="font-semibold text-ink">Seña a pagar ahora</span>
        <span className="text-lg font-bold text-sage-deep">
          {formatPrice(service.deposit)}
        </span>
      </div>
      <div className="mt-2 flex items-center justify-between border-t border-beige/70 pt-2 text-xs text-muted">
        <span>Resta abonar en el turno</span>
        <span>{formatPrice(remaining)}</span>
      </div>
    </div>
  )
}
