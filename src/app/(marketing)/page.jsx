import Link from 'next/link'
import HeroIllustration from '@/components/marketing/HeroIllustration'

export const metadata = {
  title: { absolute: 'Rapicot — Cotizaciones profesionales para tu pyme' },
  description:
    'Crea cotizaciones profesionales para tu pyme en minutos, sin Excel ni errores. Envía por WhatsApp, descarga PDF y da seguimiento.',
  openGraph: {
    title: 'Rapicot — Cotizaciones profesionales para tu pyme',
    description:
      'Crea, envía y da seguimiento a tus cotizaciones desde un solo lugar. Sin Excel, sin errores.',
    url: 'https://rapicot.cl',
    siteName: 'Rapicot',
    images: [
      {
        url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="%230D6B56"/><text x="600" y="280" font-family="Instrument Serif, serif" font-size="64" font-weight="bold" fill="white" text-anchor="middle">Rapicot</text><text x="600" y="350" font-family="Geist, sans-serif" font-size="28" fill="%23D1F0EA" text-anchor="middle">Cotizaciones profesionales para tu pyme</text><path d="M530 380l30 30 60-70" stroke="white" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M630 340c-12 12-28 20-44 16" stroke="white" stroke-width="3" fill="none" stroke-linecap="round"/></svg>',
        width: 1200,
        height: 630,
        alt: 'Rapicot — Cotizaciones profesionales',
      },
    ],
    locale: 'es_CL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rapicot — Cotizaciones profesionales para tu pyme',
    description:
      'Crea, envía y da seguimiento a tus cotizaciones desde un solo lugar.',
  },
  alternates: {
    canonical: 'https://rapicot.cl',
  },
}

function SignatureIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 11l3 3 6-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 7c-2 2-4 3-6 2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  )
}

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pb-16 pt-8 sm:pb-24 sm:pt-16">
        <div className="container-section">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="text-center lg:text-left">
              <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-brand-light bg-brand-light/50 px-3 py-1 text-xs font-medium text-brand">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                Para pymes chilenas
              </div>
              <h1 className="font-display text-4xl leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Cotizaciones profesionales{' '}
                <span className="text-brand">en minutos</span>
              </h1>
              <p className="mt-4 text-lg text-ink-soft sm:text-xl">
                Cierra el Excel. Abre Rapicot. De la consulta del cliente al PDF
                profesional en 5 minutos, sin errores ni complicaciones.
              </p>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
                <Link
                  href="/registro"
                  className="w-full rounded-full bg-accent px-8 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-accent/25 transition-all hover:bg-accent-hover hover:shadow-xl sm:w-auto"
                >
                  Crear cuenta gratis
                </Link>
                <Link
                  href="/#como-funciona"
                  className="w-full rounded-full border border-paper-deep px-8 py-3 text-center text-sm font-medium text-ink-soft transition-colors hover:border-ink-soft/30 hover:bg-paper-deep sm:w-auto"
                >
                  Cómo funciona
                </Link>
              </div>
              <p className="mt-4 text-xs text-ink-soft/60">
                Sin compromiso. Sin tarjeta de crédito.
              </p>
            </div>

            <div className="hidden lg:block">
              <HeroIllustration />
            </div>
          </div>
        </div>
      </section>

      {/* Cómo funciona — timeline */}
      <section id="como-funciona" className="bg-paper-deep px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-3 flex justify-center">
              <SignatureIcon className="w-8 h-8 text-brand" />
            </div>
            <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
              Cómo funciona
            </h2>
            <p className="mt-3 text-ink-soft">
              Llega la consulta. Abres Rapicot. Envías la cotización. Cobras.
            </p>
          </div>

          <div className="relative mt-16">
            {/* Timeline line */}
            <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-brand-light sm:block" />

            <div className="space-y-12 sm:space-y-16">
              {[
                {
                  title: 'Registras tu empresa',
                  desc: 'En menos de 30 segundos creas tu cuenta y configuras los datos de tu negocio. Sin formularios eternos.',
                  icon: (
                    <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  ),
                },
                {
                  title: 'Armas la cotización',
                  desc: 'Seleccionas el cliente, agregas productos de tu catálogo y aplicas descuentos en segundos. Todo calculado al instante.',
                  icon: (
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  ),
                },
                {
                  title: 'Compartes con un clic',
                  desc: 'Descargas el PDF con tu marca, o lo envías directo por WhatsApp o correo. El cliente lo recibe impecable.',
                  icon: (
                    <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  ),
                },
                {
                  title: 'Le das seguimiento',
                  desc: 'Sabes si está en borrador, enviada, aceptada o rechazada. Sin preguntar "¿lo recibiste?" por WhatsApp.',
                  icon: (
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  ),
                },
              ].map((step, i) => (
                <div
                  key={step.title}
                  className={`relative flex flex-col gap-4 sm:flex-row sm:items-center ${
                    i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-0 top-0 z-10 hidden sm:block sm:left-1/2 sm:-translate-x-1/2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-brand bg-paper-deep">
                      <svg className="h-4 w-4 text-brand" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 11l3 3 6-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Card */}
                  <div className={`w-full sm:w-[calc(50%-2rem)] ${i % 2 === 1 ? 'sm:text-right' : ''}`}>
                    <div className="rounded-2xl border border-paper-deep bg-paper p-6 shadow-sm">
                      <div className={`flex items-center gap-3 ${i % 2 === 1 ? 'sm:flex-row-reverse' : ''}`}>
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand text-white">
                          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            {step.icon}
                          </svg>
                        </div>
                        <div className={i % 2 === 1 ? 'sm:text-right' : ''}>
                          <h3 className="font-semibold text-ink">{step.title}</h3>
                          <p className="mt-1 text-sm text-ink-soft">{step.desc}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Spacer for alternate layout */}
                  <div className="hidden sm:block sm:w-[calc(50%-2rem)]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section id="beneficios" className="px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
              ¿Por qué dueños de pyme eligen Rapicot?
            </h2>
            <p className="mt-3 text-ink-soft">
              No es magia. Es no tener que revisar sumas a mano ni buscar aquel
              Excel perdido.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Chao Excel',
                desc: 'Tus cotizaciones no se pierden, no se borran, no se te olvida dónde las guardaste. Todo en línea, siempre.',
              },
              {
                title: 'Cero errores',
                desc: 'Subtotal, IVA, descuentos, total. La máquina suma, no tú. Adiós a las famosas "diferencias de caja".',
              },
              {
                title: 'PDF con tu cara',
                desc: 'Cada cotización sale con los datos de tu empresa, tu logo, tus colores. Parece de empresa grande.',
              },
              {
                title: 'Compartes en segundos',
                desc: 'WhatsApp, correo, descarga. No imprimes, no escaneas, no reescribes. Tu cliente lo recibe al toque.',
              },
              {
                title: 'Sabes qué pasó',
                desc: 'Borrador, enviada, aceptada, rechazada. Un vistazo y sabes por dónde va cada cotización.',
              },
              {
                title: 'Gratis, sin límites',
                desc: 'Sin planes escondidos ni topes. Todas las cotizaciones que necesites, todos los clientes que tengas.',
              },
            ].map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-2xl border border-paper-deep bg-paper p-6 shadow-sm"
              >
                <h3 className="font-semibold text-ink">{benefit.title}</h3>
                <p className="mt-2 text-sm text-ink-soft">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonios placeholder */}
      <section className="bg-paper-deep px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
              Lo que dicen quienes ya la usan
            </h2>
            <p className="mt-3 text-ink-soft">
              Pronto tendremos historias de dueños de pyme como tú.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-dashed border-ink-soft/20 bg-paper p-6 text-center"
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-paper-deep text-ink-soft">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4 4h16v2H4V4zm0 5h16v2H4V9zm0 5h10v2H4v-2zm0 5h6v2H4v-2zm13-9l-3 3 3 3 1.5-1.5L16 13l1.5-1.5L18 10zm0 5l-3 3 3 3 1.5-1.5L16 18l1.5-1.5L18 15z" />
                  </svg>
                </div>
                <div className="mx-auto mb-2 h-2 w-3/4 rounded-full bg-paper-deep" />
                <div className="mx-auto mb-1 h-2 w-1/2 rounded-full bg-paper-deep" />
                <div className="mx-auto h-2 w-2/3 rounded-full bg-paper-deep" />
                <div className="mt-4 flex items-center justify-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-paper-deep" />
                  <div className="h-3 w-20 rounded-full bg-paper-deep" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 flex justify-center">
            <svg className="h-10 w-10 text-brand" viewBox="0 0 40 40" fill="none">
              <path d="M12 24l6 6 14-16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M33 13c-4 4-9 6-14 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
            Empieza hoy —{' '}
            <span className="text-brand">es gratis</span>
          </h2>
          <p className="mt-3 text-lg text-ink-soft">
            Cierra el Excel. Tu primera cotización profesional en menos de 5
            minutos. Sin compromiso, sin tarjeta.
          </p>
          <Link
            href="/registro"
            className="mt-8 inline-flex rounded-full bg-accent px-10 py-3.5 text-base font-semibold text-white shadow-lg shadow-accent/25 transition-all hover:bg-accent-hover hover:shadow-xl"
          >
            Crear cuenta gratis
          </Link>
        </div>
      </section>
    </>
  )
}
