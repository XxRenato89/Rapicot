import Link from 'next/link'

export const metadata = {
  title: 'Precios — Rapicot',
  description:
    'Rapicot es 100% gratuito. Crea cotizaciones ilimitadas, gestiona tu catálogo y clientes, envía por WhatsApp y descarga PDF sin costo.',
  openGraph: {
    title: 'Precios — Rapicot',
    description: 'Rapicot es 100% gratuito. Sin límites, sin tarjeta de crédito.',
    url: 'https://rapicot.cl/precios',
    siteName: 'Rapicot',
    locale: 'es_CL',
    type: 'website',
  },
  alternates: { canonical: 'https://rapicot.cl/precios' },
}

const CARACTERISTICAS = [
  { texto: 'Cotizaciones ilimitadas', incluido: true },
  { texto: 'Catálogo de productos y servicios', incluido: true },
  { texto: 'Gestión de clientes', incluido: true },
  { texto: 'PDF profesional con tu marca', incluido: true },
  { texto: 'Envío por WhatsApp', incluido: true },
  { texto: 'Envío por correo electrónico', incluido: true },
  { texto: 'Vista pública para el cliente', incluido: true },
  { texto: 'Historial y seguimiento de estados', incluido: true },
  { texto: 'Funciones avanzadas (equipos, API, integraciones)', incluido: false },
]

export default function PreciosPage() {
  return (
    <>
      <section className="py-16 sm:py-24">
        <div className="container-section">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-brand-light bg-brand-light/50 px-3 py-1 text-xs font-medium text-brand">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Sin sorpresas
            </div>
            <h1 className="font-display text-3xl tracking-tight sm:text-4xl">
              Precios simples para tu pyme
            </h1>
            <p className="mt-4 text-lg text-ink-soft">
              Mientras construimos algo útil para ti, todo es gratis. Sin
              límites escondidos ni letra chica.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-lg">
            <div className="rounded-2xl border border-brand-light bg-white p-8 shadow-sm sm:p-10">
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-brand-light px-3 py-1 text-xs font-medium text-brand">
                <svg className="h-3 w-3" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 10l3 3 6-6" />
                </svg>
                Plan actual
              </div>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-display text-5xl tracking-tight text-ink">$0</span>
                <span className="text-sm text-ink-soft">/ mes</span>
              </div>
              <p className="mt-2 text-sm text-ink-soft">
                Todo lo que necesitas para cotizar como profesional, sin pagar
                un peso.
              </p>

              <ul className="mt-8 space-y-3">
                {CARACTERISTICAS.map((c) => (
                  <li key={c.texto} className="flex items-start gap-3 text-sm">
                    {c.incluido ? (
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-brand" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 10l3 3 6-6" />
                      </svg>
                    ) : (
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-ink-soft/30" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <path d="M6 6l8 8M14 6l-8 8" />
                      </svg>
                    )}
                    <span className={c.incluido ? 'text-ink' : 'text-ink-soft/50'}>{c.texto}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/registro"
                className="mt-8 flex w-full items-center justify-center rounded-full bg-accent px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition-all hover:bg-accent-hover hover:shadow-xl"
              >
                Crear cuenta gratis
              </Link>
              <p className="mt-3 text-center text-xs text-ink-soft/50">
                Sin tarjeta de crédito. Sin compromiso.
              </p>
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-paper-deep bg-paper p-6 text-center sm:p-8">
            <svg className="mx-auto h-6 w-6 text-ink-soft/40" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 12a1 1 0 110-2 1 1 0 010 2zm0-4a1 1 0 01-1-1V7a1 1 0 012 0v2a1 1 0 01-1 1z" />
            </svg>
            <p className="mt-3 text-sm text-ink-soft">
              <strong className="text-ink">¿Y después?</strong> Es posible que
              en el futuro agreguemos planes pagados con funciones adicionales
              para equipos más grandes o necesidades avanzadas. Si eso ocurre,
              te avisaremos con tiempo y siempre mantendremos un plan gratuito
              generoso. Por ahora, disfruta de Rapicot completo sin costo.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-2xl text-center">
            <h2 className="font-display text-2xl tracking-tight">
              ¿Listo para dejar el Excel atrás?
            </h2>
            <p className="mt-3 text-ink-soft">
                Crea tu cuenta en 30 segundos y empieza a cotizar como
                profesional.
            </p>
            <Link
              href="/registro"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition-all hover:bg-accent-hover hover:shadow-xl"
            >
              Crear cuenta gratis
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 10h10m-4-4l4 4-4 4" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
