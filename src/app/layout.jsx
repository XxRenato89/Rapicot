import { Geist, Geist_Mono, Instrument_Serif } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const instrumentSerif = Instrument_Serif({
  variable: '--font-instrument-serif',
  subsets: ['latin'],
  weight: ['400'],
})

export const metadata = {
  title: {
    default: 'Rapicot — Cotizaciones profesionales para tu pyme',
    template: '%s — Rapicot',
  },
  description:
    'Crea cotizaciones profesionales para tu pyme en minutos, sin Excel ni errores. Envía por WhatsApp, descarga PDF y da seguimiento.',
  icons: {
    icon: [
      {
        url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><path d="M12 24l6 6 14-16" stroke="%230D6B56" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M33 13c-3 3-7 5-11 3" stroke="%230D6B56" stroke-width="2" stroke-linecap="round" fill="none"/></svg>',
        type: 'image/svg+xml',
      },
    ],
  },
  openGraph: {
    title: 'Rapicot — Cotizaciones profesionales para tu pyme',
    description:
      'Crea, envía y da seguimiento a tus cotizaciones desde un solo lugar. Sin Excel, sin errores.',
    url: 'https://rapicot.cl',
    siteName: 'Rapicot',
    locale: 'es_CL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
  alternates: {
    canonical: 'https://rapicot.cl',
  },
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">{children}</body>
    </html>
  )
}
