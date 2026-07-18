import ContactoForm from './ContactoForm'

export const metadata = {
  title: 'Contacto',
  description:
    '¿Tienes dudas o sugerencias? Escríbenos y te respondemos a la brevedad.',
  openGraph: {
    title: 'Contacto — Rapicot',
    description: '¿Tienes dudas o sugerencias? Escríbenos.',
    url: 'https://rapicot.cl/contacto',
    siteName: 'Rapicot',
    locale: 'es_CL',
    type: 'website',
  },
  alternates: { canonical: 'https://rapicot.cl/contacto' },
}

export default function ContactoPage() {
  return (
    <div className="px-4 py-12 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <h1 className="font-display text-3xl tracking-tight sm:text-4xl">
            Contacto
          </h1>
          <p className="mt-3 text-ink-soft">
            ¿Tienes una duda, sugerencia o problema? Escríbenos y te respondemos a la
            brevedad.
          </p>
        </div>
        <ContactoForm />
      </div>
    </div>
  )
}
