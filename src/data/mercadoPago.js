// Estructura preparada para conectar Mercado Pago de verdad más adelante.
//
// - VITE_MP_PUBLIC_KEY es pública: puede vivir en el cliente (Vite solo
//   expone al navegador las variables con prefijo VITE_).
// - El Access Token de Mercado Pago es SECRETO y nunca debe usarse ni
//   guardarse en este proyecto: es un sitio estático sin backend, y
//   cualquier valor que viva en el bundle del cliente queda visible para
//   quien inspeccione el código fuente. Crear la preferencia de pago y
//   confirmar el cobro con el Access Token tiene que hacerse desde un
//   backend o función serverless (ej. una función de Vercel) que reciba acá
//   solo el resultado (aprobado / rechazado / pendiente).
//
// Mientras no exista ese backend, el flujo de pago sigue en modo
// simulación (ver PaymentModal.jsx).

export const mercadoPagoConfig = {
  publicKey: import.meta.env.VITE_MP_PUBLIC_KEY ?? null,
}

export function isMercadoPagoConfigured() {
  return Boolean(mercadoPagoConfig.publicKey)
}
