import { useState } from 'react'
import { Wallet, X, Loader2, CheckCircle2 } from 'lucide-react'
import { formatPrice } from '../data/utils'
import { isMercadoPagoConfigured } from '../data/mercadoPago'

// Modo simulación: sin credenciales reales de Mercado Pago (ver
// data/mercadoPago.js) no hay forma de crear una preferencia de pago real
// desde este sitio estático, así que el "cobro" es una animación. En
// cuanto exista un backend/función serverless que sepa el Access Token,
// `handleConfirmPayment` es el único lugar que hay que reemplazar por la
// integración real del SDK de Mercado Pago.
export default function PaymentModal({ open, amount, onClose, onConfirm }) {
  const [status, setStatus] = useState('idle')

  if (!open) return null

  function handleConfirmPayment() {
    setStatus('processing')
    setTimeout(() => {
      setStatus('approved')
      setTimeout(() => {
        onConfirm()
      }, 900)
    }, 1400)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="mp-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/50 p-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-sm overflow-hidden rounded-3xl border border-nude/70 bg-cashmere shadow-2xl shadow-obsidian/30">
        <div className="flex items-center justify-between bg-[#00aaef] px-5 py-4">
          <div className="flex items-center gap-2 text-white">
            <Wallet size={18} aria-hidden="true" />
            <span id="mp-modal-title" className="font-semibold">
              Mercado Pago
            </span>
          </div>
          {status === 'idle' && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="text-white/80 transition hover:text-white"
            >
              <X size={18} aria-hidden="true" />
            </button>
          )}
        </div>

        <div
          role="status"
          aria-live="polite"
          className="flex flex-col items-center gap-4 px-6 py-8 text-center"
        >
          {status === 'idle' && (
            <>
              <p className="text-sm text-muted">
                Vas a pagar una seña de reserva de
              </p>
              <p className="text-3xl font-bold text-plum">{formatPrice(amount)}</p>
              <button
                type="button"
                onClick={handleConfirmPayment}
                className="mt-2 w-full rounded-full bg-[#00aaef] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0090c8]"
              >
                Confirmar pago
              </button>
              <p className="text-[11px] text-muted">
                {isMercadoPagoConfigured()
                  ? 'Public key de Mercado Pago detectada, pero el checkout real todavía requiere un backend — sigue en modo simulación.'
                  : 'Simulación de pago — no se procesa ningún cobro real.'}
              </p>
            </>
          )}
          {status === 'processing' && (
            <>
              <Loader2
                size={36}
                className="animate-spin text-[#00aaef]"
                aria-hidden="true"
              />
              <p className="text-sm text-plum/80">Procesando pago...</p>
            </>
          )}
          {status === 'approved' && (
            <>
              <CheckCircle2 size={40} className="text-emerald-500" aria-hidden="true" />
              <p className="text-base font-semibold text-plum">¡Pago aprobado!</p>
              <p className="text-sm text-muted">Confirmando tu reserva...</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
