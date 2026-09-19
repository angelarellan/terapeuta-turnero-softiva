import { useState } from 'react'
import { User, Phone, AlertCircle, NotebookPen } from 'lucide-react'

export default function ContactForm({
  name,
  phone,
  notes,
  onChangeName,
  onChangePhone,
  onChangeNotes,
  attemptedSubmit,
}) {
  const [nameTouched, setNameTouched] = useState(false)
  const [phoneTouched, setPhoneTouched] = useState(false)

  const isNameValid = name.trim().length > 1
  const isPhoneValid = phone.trim().length > 6
  const showNameError = (nameTouched || attemptedSubmit) && !isNameValid
  const showPhoneError = (phoneTouched || attemptedSubmit) && !isPhoneValid

  return (
    <div className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium uppercase tracking-wide text-muted">
          Nombre y apellido <span className="text-rose-gold-deep">*</span>
        </span>
        <div
          className={`flex items-center gap-2 rounded-xl border px-3.5 py-2.5 transition ${
            showNameError
              ? 'border-red-400 bg-red-50'
              : 'border-nude bg-white/70 focus-within:border-rose-gold-deep'
          }`}
        >
          <User
            size={16}
            className={showNameError ? 'text-red-400' : 'text-muted/60'}
            aria-hidden="true"
          />
          <input
            type="text"
            required
            aria-required="true"
            aria-invalid={showNameError}
            aria-describedby={showNameError ? 'name-error' : undefined}
            autoComplete="name"
            value={name}
            onChange={(event) => onChangeName(event.target.value)}
            onBlur={() => setNameTouched(true)}
            placeholder="Ej: Juana Pérez"
            className="w-full bg-transparent text-sm text-plum placeholder:text-muted/50 focus:outline-none"
          />
        </div>
        {showNameError && (
          <p id="name-error" className="flex items-center gap-1.5 text-xs text-red-500">
            <AlertCircle size={13} aria-hidden="true" />
            Ingresá tu nombre y apellido.
          </p>
        )}
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium uppercase tracking-wide text-muted">
          WhatsApp <span className="text-rose-gold-deep">*</span>
        </span>
        <div
          className={`flex items-center gap-2 rounded-xl border px-3.5 py-2.5 transition ${
            showPhoneError
              ? 'border-red-400 bg-red-50'
              : 'border-nude bg-white/70 focus-within:border-rose-gold-deep'
          }`}
        >
          <Phone
            size={16}
            className={showPhoneError ? 'text-red-400' : 'text-muted/60'}
            aria-hidden="true"
          />
          <input
            type="tel"
            required
            aria-required="true"
            aria-invalid={showPhoneError}
            aria-describedby={showPhoneError ? 'phone-error' : undefined}
            autoComplete="tel"
            inputMode="tel"
            value={phone}
            onChange={(event) => onChangePhone(event.target.value)}
            onBlur={() => setPhoneTouched(true)}
            placeholder="Ej: 351 123 4567"
            className="w-full bg-transparent text-sm text-plum placeholder:text-muted/50 focus:outline-none"
          />
        </div>
        {showPhoneError && (
          <p id="phone-error" className="flex items-center gap-1.5 text-xs text-red-500">
            <AlertCircle size={13} aria-hidden="true" />
            Ingresá un número de WhatsApp válido.
          </p>
        )}
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium uppercase tracking-wide text-muted">
          Notas técnicas (opcional)
        </span>
        <div className="flex items-start gap-2 rounded-xl border border-nude bg-white/70 px-3.5 py-2.5 transition focus-within:border-rose-gold-deep">
          <NotebookPen size={16} className="mt-0.5 flex-shrink-0 text-muted/60" aria-hidden="true" />
          <textarea
            rows={2}
            value={notes}
            onChange={(event) => onChangeNotes(event.target.value)}
            placeholder="Ej: curvatura CC 0.15mm, alergias, diseño de cejas deseado..."
            className="w-full resize-none bg-transparent text-sm text-plum placeholder:text-muted/50 focus:outline-none"
          />
        </div>
      </label>

      <p className="text-xs text-muted">
        <span className="text-rose-gold-deep">*</span> Campos obligatorios. Te
        enviaremos la confirmación de tu turno por WhatsApp a este número.
      </p>

      {attemptedSubmit && (!isNameValid || !isPhoneValid) && (
        <p
          role="alert"
          className="flex items-center gap-2 rounded-xl border border-red-300 bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-500"
        >
          <AlertCircle size={16} className="flex-shrink-0" aria-hidden="true" />
          Completá los campos obligatorios para poder reservar tu turno.
        </p>
      )}
    </div>
  )
}
