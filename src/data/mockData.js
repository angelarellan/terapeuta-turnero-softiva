import { Eye, Waves, Feather, Layers, Layers2, Layers3, Wand2, Crown, Sparkles, Gem } from 'lucide-react'

export const SERVICES = [
  {
    id: 'lifting-pestanas',
    name: 'Lifting de Pestañas',
    description: 'Curvatura natural desde la raíz, sin necesidad de extensiones.',
    price: 25000,
    deposit: 8000,
    duration: 60,
    icon: Waves,
    badge: 'Lifting',
    image:
      'https://images.unsplash.com/photo-1589710751893-f9a6770ad71b?w=800&h=450&fit=crop&auto=format&q=80',
  },
  {
    id: 'lifting-pestanas-coreano',
    name: 'Lifting de Pestañas Coreano',
    description: 'Técnica coreana de curvatura suave y efecto más duradero.',
    price: 40000,
    deposit: 15000,
    duration: 60,
    icon: Waves,
    badge: 'Lifting',
    image:
      'https://images.unsplash.com/photo-1683719312734-e31de63957ab?w=800&h=450&fit=crop&auto=format&q=80',
  },
  {
    id: 'perfilado-cejas',
    name: 'Perfilado de Cejas',
    description: 'Diseño a medida con depilación y definición de la forma natural.',
    price: 15000,
    deposit: 5000,
    duration: 30,
    icon: Feather,
    badge: 'Cejas',
    image:
      'https://images.unsplash.com/photo-1564278692313-b2d65996fc93?w=800&h=450&fit=crop&auto=format&q=80',
  },
  {
    id: 'laminado-cejas',
    name: 'Laminado de Cejas',
    description: 'Cejas peinadas hacia arriba, con brillo y fijación de larga duración.',
    price: 20000,
    deposit: 7000,
    duration: 60,
    icon: Layers,
    badge: 'Cejas',
    image:
      'https://images.unsplash.com/photo-1674049406179-d7bf2c263e71?w=800&h=450&fit=crop&auto=format&q=80',
  },
  {
    id: 'perfilado-laminado-cejas',
    name: 'Perfilado + Laminado',
    description: 'Diseño completo: perfilado y laminado de cejas en una sola sesión.',
    price: 30000,
    deposit: 10000,
    duration: 60,
    icon: Wand2,
    badge: 'Cejas',
    image:
      'https://images.unsplash.com/photo-1718720410649-7524fcb0f0a5?w=800&h=450&fit=crop&auto=format&q=80',
  },
  {
    id: 'combo-vip',
    name: 'Lifting + Laminado + Perfilado (Combo VIP)',
    description: 'El tratamiento completo: lifting de pestañas, laminado y perfilado de cejas en un solo turno.',
    price: 50000,
    deposit: 18000,
    duration: 120,
    icon: Crown,
    badge: 'Combo VIP',
    image:
      'https://images.unsplash.com/photo-1709477542153-5bedab2b5657?w=800&h=450&fit=crop&auto=format&q=80',
  },
  {
    id: 'pestanas-clasicas',
    name: 'Pestañas Clásicas',
    description: 'Una extensión por pestaña natural, para un efecto sutil y elegante.',
    price: 25000,
    deposit: 8000,
    duration: 120,
    icon: Eye,
    badge: 'Pestañas',
    image:
      'https://images.unsplash.com/photo-1703706467603-621838cacc09?w=800&h=450&fit=crop&auto=format&q=80',
  },
  {
    id: 'pestanas-efecto-rimmel',
    name: 'Pestañas Efecto Rimmel',
    description: 'Volumen ligero que imita el efecto de un rímel bien aplicado.',
    price: 28000,
    deposit: 9000,
    duration: 120,
    icon: Sparkles,
    badge: 'Pestañas',
    image:
      'https://images.unsplash.com/photo-1639629509821-c54cdd984227?w=800&h=450&fit=crop&auto=format&q=80',
  },
  {
    id: 'pestanas-2d',
    name: 'Pestañas 2D Tecnológica',
    description: 'Técnica de abanico 2D para más densidad y volumen.',
    price: 30000,
    deposit: 10000,
    duration: 120,
    icon: Layers2,
    badge: 'Pestañas',
    image:
      'https://images.unsplash.com/photo-1674049406467-824ea37c7184?w=800&h=450&fit=crop&auto=format&q=80',
  },
  {
    id: 'pestanas-3d4d5d',
    name: 'Pestañas 3D 4D 5D Tecnológicas',
    description: 'Abanicos de 3 a 5 pestañas por extensión para un volumen dramático.',
    price: 32000,
    deposit: 10000,
    duration: 120,
    icon: Layers3,
    badge: 'Pestañas',
    image:
      'https://images.unsplash.com/photo-1735151226446-1d364b4adc2f?w=800&h=450&fit=crop&auto=format&q=80',
  },
  {
    id: 'pestanas-6d',
    name: 'Pestañas 6D (Mega Volumen)',
    description: 'Máximo volumen con abanicos 6D, para un efecto glamoroso e intenso.',
    price: 40000,
    deposit: 15000,
    duration: 180,
    icon: Gem,
    badge: 'Pestañas',
    image:
      'https://images.unsplash.com/photo-1567629307995-b9f33097bd30?w=800&h=450&fit=crop&auto=format&q=80',
  },
]

export const SEED_PROFESSIONALS = [
  {
    id: 'vicky',
    name: 'Vicky Rife',
    role: 'Lash Artist & Fundadora',
    status: 'active',
  },
]

// Datos públicos del estudio, reutilizados en el header, el pie de página,
// la sección de ubicación y las políticas de turno.
export const STUDIO_INFO = {
  name: 'VR Beauty Lash',
  founder: 'Vicky Rife',
  addressLine: 'Argüello, Córdoba, Argentina',
  instagramHandle: '@vr.beauty.lash',
  instagramUrl: 'https://www.instagram.com/vr.beauty.lash/',
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent('VR Beauty Lash, Argüello, Córdoba, Argentina'),
  mapsEmbedUrl:
    'https://maps.google.com/maps?q=' +
    encodeURIComponent('Argüello, Córdoba, Argentina') +
    '&z=14&output=embed',
  // WhatsApp del estudio (dueña), en formato E.164 sin "+" ni espacios.
  whatsappNumber: '5493512444051',
}

// Turnos ocupados de ejemplo para simular disponibilidad real (además de
// los que ya figuran en SEED_APPOINTMENTS). Cada uno con su propia
// duración, para que el bloqueo de horarios sea realista.
export const BOOKED_SLOTS = {
  vicky: [
    { time: '08:00', duration: 45 },
    { time: '19:30', duration: 30 },
  ],
}

// Estados de pago posibles para un turno
export const PAYMENT_STATUSES = {
  pendiente: {
    label: 'Pendiente de Seña',
    color: 'amber',
  },
  senado_mp: {
    label: 'Señado - Mercado Pago',
    color: 'sky',
  },
  senado_transferencia: {
    label: 'Señado - Transferencia',
    color: 'indigo',
  },
  pagado_completo: {
    label: 'Pagado Completo',
    color: 'emerald',
  },
}

export const SEED_APPOINTMENTS = [
  {
    id: 'seed-1',
    clientName: 'Martina Gómez',
    clientPhone: '351 555 0142',
    serviceId: 'pestanas-3d4d5d',
    barberId: 'vicky',
    date: new Date().toISOString().slice(0, 10),
    time: '10:00',
    reminderSent: false,
    paymentStatus: 'senado_mp',
    notes: 'Curvatura CC, 0.15mm. Sin alergias conocidas.',
  },
  {
    id: 'seed-2',
    clientName: 'Facundo Ríos',
    clientPhone: '351 555 0198',
    serviceId: 'perfilado-cejas',
    barberId: 'vicky',
    date: new Date().toISOString().slice(0, 10),
    time: '16:30',
    reminderSent: true,
    paymentStatus: 'pagado_completo',
    notes: 'Diseño recto, tinte castaño oscuro.',
  },
  {
    id: 'seed-3',
    clientName: 'Bruna Aguirre',
    clientPhone: '351 555 0163',
    serviceId: 'lifting-pestanas',
    barberId: 'vicky',
    date: new Date().toISOString().slice(0, 10),
    time: '17:00',
    reminderSent: false,
    paymentStatus: 'senado_transferencia',
    notes: '',
  },
]
