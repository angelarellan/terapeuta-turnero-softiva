import { useMemo, useState } from 'react'
import { Wallet, Banknote, TrendingUp, FileDown, Filter } from 'lucide-react'
import { SERVICES, PAYMENT_STATUSES } from '../data/mockData'
import { downloadCSV, formatPrice, getRangeBounds, todayISO } from '../data/utils'
import AppointmentsTable from './AppointmentsTable'

function findService(id) {
  return SERVICES.find((s) => s.id === id)
}

const RANGE_OPTIONS = [
  { value: 'today', label: 'Hoy' },
  { value: 'week', label: 'Esta semana' },
  { value: 'month', label: 'Este mes' },
  { value: 'all', label: 'Todos' },
]

export default function AdminHistory({
  appointments,
  professionals,
  onCancelAppointment,
  onUpdatePaymentStatus,
  onUpdateNotes,
}) {
  const [range, setRange] = useState('month')
  const [statusFilter, setStatusFilter] = useState('all')

  const rangeBounds = useMemo(() => getRangeBounds(range), [range])

  const filteredAppointments = useMemo(() => {
    return appointments
      .filter((a) => {
        if (!rangeBounds) return true
        return a.date >= rangeBounds.from && a.date <= rangeBounds.to
      })
      .filter((a) => statusFilter === 'all' || a.paymentStatus === statusFilter)
      .sort((a, b) => (a.date === b.date ? a.time.localeCompare(b.time) : a.date.localeCompare(b.date)))
  }, [appointments, rangeBounds, statusFilter])

  const activeAppointments = useMemo(
    () => filteredAppointments.filter((a) => a.status !== 'cancelled'),
    [filteredAppointments],
  )

  const totalDeposited = useMemo(
    () =>
      activeAppointments.reduce((sum, a) => {
        if (a.paymentStatus === 'pendiente') return sum
        return sum + (findService(a.serviceId)?.deposit ?? 0)
      }, 0),
    [activeAppointments],
  )

  const pendingAtCabinet = useMemo(
    () =>
      activeAppointments.reduce((sum, a) => {
        const service = findService(a.serviceId)
        if (!service) return sum
        if (a.paymentStatus === 'pagado_completo') return sum
        if (a.paymentStatus === 'pendiente') return sum + service.price
        return sum + (service.price - service.deposit)
      }, 0),
    [activeAppointments],
  )

  const monthlyIncome = useMemo(() => {
    const { from, to } = getRangeBounds('month')
    return appointments
      .filter((a) => a.status !== 'cancelled' && a.date >= from && a.date <= to)
      .reduce((sum, a) => sum + (findService(a.serviceId)?.price ?? 0), 0)
  }, [appointments])

  function handleExport() {
    const rows = [
      ['Fecha', 'Hora', 'Cliente', 'Teléfono', 'Servicio', 'Especialista', 'Precio', 'Seña', 'Estado de pago', 'Notas técnicas'],
      ...filteredAppointments.map((a) => {
        const service = findService(a.serviceId)
        const barber = professionals.find((p) => p.id === a.barberId)
        return [
          a.date,
          a.time,
          a.clientName,
          a.clientPhone,
          service?.name ?? '',
          barber?.name ?? '',
          service?.price ?? '',
          service?.deposit ?? '',
          PAYMENT_STATUSES[a.paymentStatus]?.label ?? '',
          a.notes ?? '',
        ]
      }),
    ]
    downloadCSV(`historial-turnos-${todayISO()}.csv`, rows)
  }

  return (
    <div className="mt-8">
      <div className="mb-4">
        <h2 className="font-serif text-lg font-semibold text-plum">
          Historial & Contabilidad
        </h2>
        <p className="mt-1 text-sm text-muted">
          Métricas financieras, estado de pago por turno y exportación del historial.
        </p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border border-nude/70 bg-white/55 p-4 shadow-xl shadow-rose-gold-deep/10 backdrop-blur-md">
          <div className="flex items-center gap-2 text-muted">
            <Wallet size={15} aria-hidden="true" />
            <span className="text-xs uppercase tracking-wide">Recaudado en señas</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-plum">{formatPrice(totalDeposited)}</p>
        </div>
        <div className="rounded-3xl border border-nude/70 bg-white/55 p-4 shadow-xl shadow-rose-gold-deep/10 backdrop-blur-md">
          <div className="flex items-center gap-2 text-muted">
            <Banknote size={15} aria-hidden="true" />
            <span className="text-xs uppercase tracking-wide">Pendiente a cobrar en gabinete</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-rose-gold-deep">{formatPrice(pendingAtCabinet)}</p>
        </div>
        <div className="rounded-3xl border border-nude/70 bg-white/55 p-4 shadow-xl shadow-rose-gold-deep/10 backdrop-blur-md">
          <div className="flex items-center gap-2 text-muted">
            <TrendingUp size={15} aria-hidden="true" />
            <span className="text-xs uppercase tracking-wide">Ingresos totales del mes</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-plum">{formatPrice(monthlyIncome)}</p>
        </div>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5 rounded-full border border-nude/70 bg-white/50 p-1">
          {RANGE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setRange(option.value)}
              aria-pressed={range === option.value}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition sm:text-sm ${
                range === option.value
                  ? 'bg-gradient-to-r from-rose-gold to-champagne text-obsidian'
                  : 'text-plum/70 hover:text-plum'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 rounded-full border border-nude/70 bg-white/60 px-3.5 py-2 text-xs text-plum/70">
            <Filter size={13} className="text-rose-gold-deep" aria-hidden="true" />
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="bg-transparent text-xs font-medium text-plum focus:outline-none sm:text-sm"
            >
              <option value="all">Todos los estados</option>
              {Object.entries(PAYMENT_STATUSES).map(([value, info]) => (
                <option key={value} value={value}>
                  {info.label}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-rose-gold to-champagne px-4 py-2 text-xs font-semibold text-obsidian transition hover:brightness-105 sm:text-sm"
          >
            <FileDown size={14} aria-hidden="true" />
            Exportar CSV
          </button>
        </div>
      </div>

      <AppointmentsTable
        appointments={filteredAppointments}
        professionals={professionals}
        onCancelAppointment={onCancelAppointment}
        onUpdatePaymentStatus={onUpdatePaymentStatus}
        onUpdateNotes={onUpdateNotes}
        showReminder={false}
        emptyMessage="No hay turnos para el rango y estado seleccionados."
      />
    </div>
  )
}
