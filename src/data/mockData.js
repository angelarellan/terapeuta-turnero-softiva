import { User, Users, ClipboardList, Leaf, Video } from 'lucide-react'

export const SERVICES = [
  {
    id: 'terapia-individual',
    name: 'Sesión de Terapia Individual',
    description: 'Un espacio de escucha y acompañamiento profesional para tu bienestar emocional.',
    price: 20000,
    deposit: 5000,
    duration: 60,
    icon: User,
    badge: 'Individual',
    image:
      'https://images.unsplash.com/photo-1758273240631-59d44c8f5b66?w=800&h=450&fit=crop&auto=format&q=80',
  },
  {
    id: 'terapia-pareja',
    name: 'Sesión de Terapia de Pareja',
    description: 'Trabajamos juntos la comunicación y el vínculo para fortalecer la relación.',
    price: 30000,
    deposit: 8000,
    duration: 60,
    icon: Users,
    badge: 'Pareja',
    image:
      'https://images.unsplash.com/photo-1542338347-4fff3276af78?w=800&h=450&fit=crop&auto=format&q=80',
  },
  {
    id: 'consulta-evaluacion',
    name: 'Consulta / Evaluación Inicial',
    description: 'Primer encuentro para conocer tu motivo de consulta y diseñar el plan a seguir.',
    price: 15000,
    deposit: 5000,
    duration: 60,
    icon: ClipboardList,
    badge: 'Evaluación',
    image:
      'https://images.unsplash.com/photo-1758273241086-f3585ef8c2f8?w=800&h=450&fit=crop&auto=format&q=80',
  },
  {
    id: 'terapia-holistica-mindfulness',
    name: 'Terapia Holística & Mindfulness',
    description: 'Técnicas de respiración, atención plena y bienestar integral cuerpo-mente.',
    price: 25000,
    deposit: 6000,
    duration: 60,
    icon: Leaf,
    badge: 'Holística',
    image:
      'https://images.unsplash.com/photo-1637245048732-adf1a547835e?w=800&h=450&fit=crop&auto=format&q=80',
  },
  {
    id: 'sesion-online',
    name: 'Sesión Online (Teleconsulta)',
    description: 'La misma calidad de atención, desde la comodidad de tu hogar por videollamada.',
    price: 18000,
    deposit: 5000,
    duration: 60,
    icon: Video,
    badge: 'Online',
    image:
      'https://images.unsplash.com/photo-1758521541324-d304c5303fe5?w=800&h=450&fit=crop&auto=format&q=80',
  },
]

export const SEED_PROFESSIONALS = [
  {
    id: 'lic-demo',
    name: 'Lic. Demo',
    role: 'Psicóloga & Fundadora',
    status: 'active',
  },
]

// Datos públicos del espacio terapéutico, reutilizados en el header, el pie
// de página, la sección de ubicación y las políticas de turno.
export const STUDIO_INFO = {
  name: 'Espacio Terapéutico',
  founder: 'Lic. Demo',
  addressLine: 'Argüello, Córdoba, Argentina',
  instagramHandle: '@espacio.terapeutico',
  instagramUrl: 'https://www.instagram.com/espacio.terapeutico/',
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent('Espacio Terapéutico, Argüello, Córdoba, Argentina'),
  mapsEmbedUrl:
    'https://maps.google.com/maps?q=' +
    encodeURIComponent('Argüello, Córdoba, Argentina') +
    '&z=14&output=embed',
  // WhatsApp del espacio terapéutico, en formato E.164 sin "+" ni espacios.
  whatsappNumber: '5493512444051',
}

// Turnos ocupados de ejemplo para simular disponibilidad real (además de
// los que ya figuran en SEED_APPOINTMENTS). Cada uno con su propia
// duración, para que el bloqueo de horarios sea realista.
export const BOOKED_SLOTS = {
  'lic-demo': [
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
    serviceId: 'terapia-individual',
    barberId: 'lic-demo',
    date: new Date().toISOString().slice(0, 10),
    time: '10:00',
    reminderSent: false,
    paymentStatus: 'senado_mp',
    notes: 'Primera sesión de seguimiento. Sin observaciones previas.',
  },
  {
    id: 'seed-2',
    clientName: 'Facundo Ríos',
    clientPhone: '351 555 0198',
    serviceId: 'consulta-evaluacion',
    barberId: 'lic-demo',
    date: new Date().toISOString().slice(0, 10),
    time: '16:30',
    reminderSent: true,
    paymentStatus: 'pagado_completo',
    notes: 'Evaluación inicial, deriva de consulta general.',
  },
  {
    id: 'seed-3',
    clientName: 'Bruna Aguirre',
    clientPhone: '351 555 0163',
    serviceId: 'terapia-holistica-mindfulness',
    barberId: 'lic-demo',
    date: new Date().toISOString().slice(0, 10),
    time: '17:00',
    reminderSent: false,
    paymentStatus: 'senado_transferencia',
    notes: '',
  },
]
