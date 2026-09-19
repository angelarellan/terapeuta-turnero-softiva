import { useState } from 'react'
import { UserPlus, Palmtree, RotateCcw, Trash2, X } from 'lucide-react'

function initials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

export default function ProfessionalsManager({
  professionals,
  onAdd,
  onToggleStatus,
  onRemove,
}) {
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [role, setRole] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    if (!name.trim() || !role.trim()) return
    onAdd({
      id: `prof-${Date.now()}`,
      name: name.trim(),
      role: role.trim(),
      status: 'active',
    })
    setName('')
    setRole('')
    setShowForm(false)
  }

  function handleCloseForm() {
    setShowForm(false)
    setName('')
    setRole('')
  }

  function handleRemove(id, personName) {
    const confirmed = window.confirm(
      `¿Confirmás dar de baja a ${personName}? Ya no va a aparecer para reservar turnos.`,
    )
    if (!confirmed) return
    onRemove(id)
  }

  return (
    <div className="mt-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-lg font-semibold text-plum">Especialistas</h2>
          <p className="mt-1 text-sm text-muted">
            Agregá, dá de baja o marcá vacaciones para el equipo.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((s) => !s)}
          className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-rose-gold to-champagne px-4 py-2 text-sm font-semibold text-obsidian transition hover:brightness-105"
        >
          <UserPlus size={15} aria-hidden="true" />
          Agregar especialista
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-4 flex flex-col gap-3 rounded-3xl border border-nude/70 bg-white/55 p-4 shadow-lg shadow-rose-gold-deep/10 backdrop-blur-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-plum">Nuevo especialista</span>
            <button
              type="button"
              onClick={handleCloseForm}
              aria-label="Cerrar formulario de nuevo especialista"
              className="flex h-7 w-7 items-center justify-center rounded-full text-muted transition hover:bg-nude/40 hover:text-plum"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="flex flex-1 flex-col gap-1.5">
              <span className="text-xs font-medium uppercase tracking-wide text-muted">
                Nombre
              </span>
              <input
                type="text"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Ej: Ana Pérez"
                className="rounded-xl border border-nude bg-white/70 px-3.5 py-2.5 text-sm text-plum placeholder:text-muted/50 focus:border-rose-gold-deep focus:outline-none"
              />
            </label>
            <label className="flex flex-1 flex-col gap-1.5">
              <span className="text-xs font-medium uppercase tracking-wide text-muted">
                Especialidad
              </span>
              <input
                type="text"
                required
                value={role}
                onChange={(event) => setRole(event.target.value)}
                placeholder="Ej: Microblading"
                className="rounded-xl border border-nude bg-white/70 px-3.5 py-2.5 text-sm text-plum placeholder:text-muted/50 focus:border-rose-gold-deep focus:outline-none"
              />
            </label>
            <button
              type="submit"
              className="rounded-full bg-gradient-to-r from-rose-gold to-champagne px-5 py-2.5 text-sm font-semibold text-obsidian transition hover:brightness-105"
            >
              Agregar
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-col gap-3">
        {professionals.length === 0 && (
          <p className="rounded-3xl border border-nude/70 bg-white/55 p-4 text-sm text-muted">
            No hay especialistas cargadas.
          </p>
        )}
        {professionals.map((professional) => {
          const isActive = professional.status === 'active'
          return (
            <div
              key={professional.id}
              className="flex flex-col gap-3 rounded-3xl border border-nude/70 bg-white/55 p-4 shadow-lg shadow-rose-gold-deep/10 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-nude/50 text-sm font-semibold text-plum/70"
                >
                  {initials(professional.name)}
                </span>
                <div>
                  <p className="font-medium text-plum">{professional.name}</p>
                  <p className="text-xs text-muted">{professional.role}</p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                    isActive
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-amber-100 text-amber-600'
                  }`}
                >
                  {isActive ? 'Activa' : 'De vacaciones'}
                </span>
              </div>
              <div className="flex flex-shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => onToggleStatus(professional.id)}
                  aria-label={
                    isActive
                      ? `Marcar a ${professional.name} de vacaciones`
                      : `Reactivar a ${professional.name}`
                  }
                  className="flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-600 transition hover:bg-amber-100"
                >
                  {isActive ? (
                    <>
                      <Palmtree size={12} aria-hidden="true" />
                      Vacaciones
                    </>
                  ) : (
                    <>
                      <RotateCcw size={12} aria-hidden="true" />
                      Reactivar
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(professional.id, professional.name)}
                  aria-label={`Dar de baja a ${professional.name}`}
                  className="flex items-center gap-1.5 rounded-full border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-100"
                >
                  <Trash2 size={12} aria-hidden="true" />
                  Dar de baja
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
