export const metadata = {
  title: 'Política de Privacidad',
  description:
    'Conoce cómo Rapicot protege tus datos personales y los de tus clientes. Política clara y simple para pymes chilenas.',
  openGraph: {
    title: 'Política de Privacidad — Rapicot',
    description:
      'Conoce cómo Rapicot protege tus datos personales y los de tus clientes.',
    url: 'https://rapicot.cl/privacidad',
    siteName: 'Rapicot',
    locale: 'es_CL',
    type: 'website',
  },
  alternates: { canonical: 'https://rapicot.cl/privacidad' },
}

export default function PrivacidadPage() {
  return (
    <div className="px-4 py-12 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-3xl tracking-tight sm:text-4xl">
          Política de Privacidad
        </h1>
        <p className="mt-2 text-sm text-ink-soft">Última actualización: julio 2026</p>

        <div className="mt-10 space-y-5 leading-relaxed text-ink-soft [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-ink [&_strong]:text-ink [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5">
          <h2>1. ¿Quién es el responsable?</h2>
          <p>
            Rapicot (en adelante, &ldquo;la aplicación&rdquo; o &ldquo;nosotros&rdquo;) es una
            plataforma de cotizaciones para pymes chilenas. Al crear una cuenta, confías tus datos
            a nosotros, y nos tomamos esa confianza en serio.
          </p>

          <h2>2. ¿Qué datos recopilamos?</h2>
          <p>Cuando usas Rapicot, recopilamos la siguiente información:</p>
          <ul>
            <li>
              <strong>Datos de tu empresa:</strong> nombre o razón social, RUT, dirección,
              teléfono, correo electrónico y logo.
            </li>
            <li>
              <strong>Datos de tus clientes:</strong> nombre, RUT, dirección, teléfono y correo
              que tú ingresas para emitir tus cotizaciones.
            </li>
            <li>
              <strong>Datos de cotizaciones:</strong> productos, servicios, precios, descuentos,
              montos y estado de cada cotización que creas.
            </li>
            <li>
              <strong>Datos de la cuenta:</strong> correo electrónico y contraseña (encriptada)
              que usas para iniciar sesión.
            </li>
          </ul>
          <p>
            <strong>No almacenamos datos de pago.</strong> Rapicot aún no procesa pagos. Las
            transacciones se realizan fuera de la aplicación, directamente entre tú y tu cliente.
          </p>

          <h2>3. ¿Para qué usamos tus datos?</h2>
          <ul>
            <li>Para que puedas crear, enviar y gestionar tus cotizaciones.</li>
            <li>Para mejorar la aplicación y ofrecerte una mejor experiencia.</li>
            <li>
              Para comunicarnos contigo respecto al servicio (novedades, cambios en términos,
              etc.).
            </li>
          </ul>
          <p>
            No vendemos ni compartimos tus datos con terceros para fines comerciales. No nos
            gustaría que lo hicieran con los nuestros.
          </p>

          <h2>4. ¿Dónde y cómo guardamos los datos?</h2>
          <p>
            Tus datos se almacenan en servidores seguros en la nube, con proveedores que cumplen
            estándares internacionales de seguridad (Supabase, en infraestructura AWS). Toda la
            información viaja encriptada mediante HTTPS y las contraseñas se almacenan con hash
            —nadie, ni siquiera nosotros, puede leer tu contraseña.
          </p>

          <h2>5. ¿Por cuánto tiempo conservamos los datos?</h2>
          <p>
            Conservamos tus datos mientras tu cuenta esté activa. Si eliminas tu cuenta, tus
            datos se borran en un plazo máximo de 30 días. Los datos de clientes asociados a tus
            cotizaciones se eliminan junto con tu cuenta.
          </p>

          <h2>6. ¿Qué derechos tienes?</h2>
          <p>
            Como usuario, tienes derecho a:
          </p>
          <ul>
            <li>
              <strong>Acceder</strong> a los datos que tenemos sobre ti.
            </li>
            <li>
              <strong>Corregir</strong> datos incorrectos o desactualizados.
            </li>
            <li>
              <strong>Solicitar la eliminación</strong> de tus datos (derecho al olvido).
            </li>
            <li>
              <strong>Exportar</strong> tus datos en un formato portable.
            </li>
          </ul>
          <p>
            Para ejercer cualquiera de estos derechos, escríbenos a{' '}
            <a href="mailto:hola@rapicot.cl" className="text-brand underline">
              hola@rapicot.cl
            </a>
            . Respondemos a la brevedad.
          </p>

          <h2>7. Cambios a esta política</h2>
          <p>
            Si esta política cambia de forma importante, te avisaremos por correo electrónico
            y/o mediante un aviso dentro de la aplicación.
          </p>

          <h2>8. Contacto</h2>
          <p>
            Si tienes preguntas sobre esta política o sobre cómo manejamos tus datos, escríbenos
            a{' '}
            <a href="mailto:hola@rapicot.cl" className="text-brand underline">
              hola@rapicot.cl
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
