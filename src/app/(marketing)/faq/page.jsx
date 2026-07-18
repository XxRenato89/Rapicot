'use client'

import { useState } from 'react'

const faqs = [
  {
    q: '¿Rapicot reemplaza una factura?',
    a: 'No. Rapicot es una herramienta para crear cotizaciones, no facturas electrónicas. La cotización es el documento previo donde ofreces tus productos o servicios con sus precios. Para facturar, necesitas un sistema de facturación electrónica autorizado por el SII. Rapicot sí te entrega los datos ordenados para que puedas facturar después sin tener que escribir todo de nuevo.',
  },
  {
    q: '¿Mis datos están seguros?',
    a: 'Sí. Toda la información viaja encriptada mediante HTTPS y las contraseñas se almacenan con hash (nadie puede leerlas, ni nosotros). Los datos se guardan en servidores seguros con proveedores que cumplen estándares internacionales (Supabase sobre AWS). Puedes revisar nuestra Política de Privacidad para más detalles.',
  },
  {
    q: '¿Tiene costo?',
    a: 'No. Actualmente Rapicot es completamente gratuito, sin límite de cotizaciones, clientes ni productos. Si en el futuro implementamos planes pagados, avisaremos con al menos 30 días de anticipación y los usuarios registrados tendrán condiciones preferentes.',
  },
  {
    q: '¿Puedo usarlo desde el celular?',
    a: 'Sí. Rapicot funciona en el navegador de cualquier dispositivo: computador, tablet o celular. No necesitas descargar ninguna aplicación. El diseño se adapta automáticamente a la pantalla de tu equipo.',
  },
  {
    q: '¿Qué pasa si cambio de plan o dejo de usar la aplicación?',
    a: 'Si decides dejar de usar Rapicot, puedes descargar tus datos o eliminar tu cuenta desde la sección de perfil. Tus cotizaciones y datos de clientes se eliminarán en un plazo máximo de 30 días. Si vuelves después, puedes crear una cuenta nueva.',
  },
  {
    q: '¿Puedo personalizar el diseño de mis cotizaciones?',
    a: 'Sí. Las cotizaciones incluyen automáticamente el nombre, RUT, dirección y logo de tu empresa. En la sección Mi Empresa puedes actualizar tus datos y subir tu logo. El PDF se genera con esa información, dando un aspecto profesional y uniforme.',
  },
  {
    q: '¿Cómo comparto una cotización con mi cliente?',
    a: 'Desde la pantalla de la cotización puedes descargarla en PDF, enviarla por WhatsApp con un solo clic o copiar un enlace para compartirla por correo. Cuando compartes una cotización, el sistema la marca automáticamente como "enviada" para que puedas hacer seguimiento.',
  },
  {
    q: '¿Los clientes ven los precios de otros clientes?',
    a: 'No. Cada cliente ve solo su propia cotización y solo si tú se la envías. Los datos están aislados por cuenta de empresa: tú ves toda tu información, pero tus clientes no tienen acceso a la aplicación ni pueden ver las cotizaciones de otros.',
  },
  {
    q: '¿Puedo tener más de un usuario en mi empresa?',
    a: 'Por ahora, cada cuenta es para un usuario. Si necesitas que varias personas de tu equipo creen cotizaciones, cada una debe tener su propia cuenta. Estamos evaluando agregar planes multiusuario en el futuro.',
  },
  {
    q: '¿Qué necesito para empezar?',
    a: 'Solo un correo electrónico y menos de 30 segundos. Creas tu cuenta, registras los datos de tu empresa y ya puedes crear tu primera cotización. No necesitas tarjeta de crédito ni ningún otro requisito.',
  },
]

function AccordionItem({ faq, isOpen, onToggle }) {
  return (
    <div className="border-b border-paper-deep">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="text-base font-medium text-ink">{faq.q}</span>
        <svg
          className={`h-5 w-5 shrink-0 text-ink-soft transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 7l5 5 5-5" />
        </svg>
      </button>
      {isOpen && (
        <div className="pb-5 pr-8 text-sm leading-relaxed text-ink-soft">{faq.a}</div>
      )}
    </div>
  )
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <div className="px-4 py-12 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <h1 className="font-display text-3xl tracking-tight sm:text-4xl">
            Preguntas Frecuentes
          </h1>
          <p className="mt-3 text-ink-soft">
            Las dudas más comunes de quienes usan Rapicot por primera vez.
          </p>
        </div>

        <div className="mt-12 divide-y divide-paper-deep rounded-2xl border border-paper-deep bg-paper px-6">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              faq={faq}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
