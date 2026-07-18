export const metadata = {
  title: 'Política de Cookies',
  description:
    'Conoce qué cookies utiliza Rapicot, para qué sirven y cómo puedes controlarlas.',
  openGraph: {
    title: 'Política de Cookies — Rapicot',
    description: 'Conoce qué cookies utiliza Rapicot y cómo gestionarlas.',
    url: 'https://rapicot.cl/cookies',
    siteName: 'Rapicot',
    locale: 'es_CL',
    type: 'website',
  },
  alternates: { canonical: 'https://rapicot.cl/cookies' },
}

export default function CookiesPage() {
  return (
    <div className="px-4 py-12 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-3xl tracking-tight sm:text-4xl">
          Política de Cookies
        </h1>
        <p className="mt-2 text-sm text-ink-soft">Última actualización: julio 2026</p>

        <div className="mt-10 space-y-5 leading-relaxed text-ink-soft [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-ink [&_strong]:text-ink [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5">
          <h2>¿Qué son las cookies?</h2>
          <p>
            Las cookies son pequeños archivos de texto que se almacenan en tu navegador cuando
            visitas un sitio web. Sirven para que el sitio funcione correctamente, recuerde tus
            preferencias y mejore tu experiencia.
          </p>

          <h2>¿Qué cookies usa Rapicot?</h2>
          <p>En Rapicot utilizamos exclusivamente las siguientes cookies:</p>

          <h3 className="mt-6 font-semibold text-ink">Cookies técnicas o de sesión</h3>
          <p>
            Son necesarias para que la aplicación funcione. Se usan para mantener tu sesión
            iniciada mientras navegas por las páginas protegidas (como el dashboard). Sin estas
            cookies, no podrías usar la aplicación.
          </p>
          <ul>
            <li>
              <strong>Cookie de sesión de Supabase:</strong> permite mantener la autenticación
              del usuario mientras está logueado. Se elimina al cerrar sesión.
            </li>
          </ul>

          <h3 className="mt-6 font-semibold text-ink">Cookie de preferencias</h3>
          <p>
            Guardamos una cookie propia para recordar si has aceptado o no nuestra política de
            cookies. Esta cookie no recopila información personal y solo sirve para no mostrarte
            el aviso cada vez que entras.
          </p>
          <ul>
            <li>
              <strong>rapicot-cookies-v1:</strong> almacena tu preferencia sobre el aviso de
              cookies. Tiene una duración indefinida (hasta que la borres manualmente).
            </li>
          </ul>

          <h3 className="mt-6 font-semibold text-ink">Cookies de analytics</h3>
          <p>
            Actualmente <strong>no utilizamos</strong> cookies de terceros ni herramientas de
            analytics (como Google Analytics). Si en el futuro incorporamos alguna, actualizaremos
            esta página y te pediremos consentimiento.
          </p>

          <h2>¿Cómo controlar las cookies?</h2>
          <p>
            Puedes deshabilitar o eliminar las cookies desde la configuración de tu navegador.
            Ten en cuenta que al hacerlo, algunas funciones de Rapicot podrían no funcionar
            correctamente (por ejemplo, iniciar sesión).
          </p>
          <p>
            Para gestionar las cookies en los navegadores más populares:
          </p>
          <ul>
            <li>
              <a
                href="https://support.google.com/chrome/answer/95647"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand underline"
              >
                Chrome
              </a>
            </li>
            <li>
              <a
                href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand underline"
              >
                Firefox
              </a>
            </li>
            <li>
              <a
                href="https://support.microsoft.com/es-es/windows/eliminar-y-administrar-cookies-168dab11-0753-043d-7c16-ede5947fc64d"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand underline"
              >
                Edge
              </a>
            </li>
            <li>
              <a
                href="https://support.apple.com/es-es/guide/safari/sfri11471/mac"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand underline"
              >
                Safari
              </a>
            </li>
          </ul>

          <h2>Más información</h2>
          <p>
            Si tienes preguntas sobre el uso de cookies en Rapicot, escríbenos a{' '}
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
