import { Check } from 'lucide-react'

export default function StepIndicator({ steps, currentStep }) {
  return (
    <ol className="mx-auto flex w-full max-w-2xl items-center justify-between px-2">
      {steps.map((label, index) => {
        const stepNumber = index + 1
        const isDone = stepNumber < currentStep
        const isActive = stepNumber === currentStep
        return (
          <li
            key={label}
            aria-current={isActive ? 'step' : undefined}
            className="flex flex-1 items-center last:flex-none"
          >
            <span className="sr-only">
              {`Paso ${stepNumber} de ${steps.length}: ${label}${
                isDone ? ' (completado)' : isActive ? ' (paso actual)' : ''
              }`}
            </span>
            <div aria-hidden="true" className="flex flex-col items-center gap-1.5">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition ${
                  isDone
                    ? 'bg-gradient-to-br from-sage to-gold text-charcoal'
                    : isActive
                      ? 'border-2 border-sage-deep text-sage-deep'
                      : 'border border-beige text-ink/70'
                }`}
              >
                {isDone ? <Check size={15} /> : stepNumber}
              </span>
              <span
                className={`hidden text-[11px] sm:block ${
                  isActive ? 'text-ink' : 'text-muted'
                }`}
              >
                {label}
              </span>
            </div>
            {stepNumber !== steps.length && (
              <span
                className={`mx-2 h-px flex-1 ${
                  isDone ? 'bg-gradient-to-r from-sage to-gold' : 'bg-beige/60'
                }`}
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}
