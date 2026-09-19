export default function Footer() {
  return (
    <footer className="border-t border-nude/60 bg-cashmere px-4 py-8 text-center sm:px-6">
      <img
        src="/logo.jpg"
        alt=""
        aria-hidden="true"
        width={56}
        height={56}
        loading="lazy"
        className="mx-auto mb-3 h-14 w-14 rounded-full object-cover shadow-sm shadow-rose-gold-deep/20"
      />
      <p className="text-sm text-muted">
        Desarrollado por{' '}
        <a
          href="https://www.softivastudio.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-rose-gold-deep transition hover:text-champagne"
        >
          Softiva Studio
        </a>
      </p>
      <p className="mt-1 text-xs text-muted">
        Demo de agendamiento — VR Beauty Lash © {new Date().getFullYear()}
      </p>
    </footer>
  )
}
