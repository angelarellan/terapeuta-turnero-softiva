export default function Footer() {
  return (
    <footer className="border-t border-beige/60 bg-cream px-4 py-8 text-center sm:px-6">
      <img
        src="/logo.svg"
        alt=""
        aria-hidden="true"
        width={56}
        height={56}
        loading="lazy"
        className="mx-auto mb-3 h-14 w-14 rounded-full object-cover shadow-sm shadow-sage-deep/20"
      />
      <p className="text-sm text-muted">
        Desarrollado por{' '}
        <a
          href="https://www.softivastudio.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-sage-deep transition hover:text-gold"
        >
          Softiva Studio
        </a>
      </p>
      <p className="mt-1 text-xs text-muted">
        Demo de agendamiento — Espacio Terapéutico © {new Date().getFullYear()}
      </p>
    </footer>
  )
}
