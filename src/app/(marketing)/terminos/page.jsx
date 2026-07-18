export const metadata = {
  title: 'Términos y Condiciones',
  description:
    'Términos de uso de Rapicot. Al usar la aplicación aceptas estas condiciones. Lee con atención antes de crear tu cuenta.',
  openGraph: {
    title: 'Términos y Condiciones — Rapicot',
    description:
      'Términos de uso de Rapicot para la creación y gestión de cotizaciones profesionales.',
    url: 'https://rapicot.cl/terminos',
    siteName: 'Rapicot',
    locale: 'es_CL',
    type: 'website',
  },
  alternates: { canonical: 'https://rapicot.cl/terminos' },
}

export default function TerminosPage() {
  return (
    <div className="px-4 py-12 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-3xl tracking-tight sm:text-4xl">
          Términos y Condiciones
        </h1>
        <p className="mt-2 text-sm text-ink-soft">Última actualización: julio 2026</p>

        <div className="mt-10 space-y-5 leading-relaxed text-ink-soft [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-ink [&_strong]:text-ink [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5">
          <h2>1. Aceptación de los términos</h2>
          <p>
            Al crear una cuenta en Rapicot, declaras haber leído, entendido y aceptado estos
            Términos y Condiciones. Si no estás de acuerdo, no debes usar la aplicación.
          </p>

          <h2>2. Descripción del servicio</h2>
          <p>
            Rapicot es una herramienta en línea que permite a pymes y emprendedores crear,
            enviar y gestionar cotizaciones de productos y servicios. La aplicación ofrece:
          </p>
          <ul>
            <li>Registro de empresa y clientes.</li>
            <li>Catálogo de productos o servicios.</li>
            <li>Generación de cotizaciones con cálculos automáticos (subtotal, IVA, descuentos).</li>
            <li>Descarga en PDF y opciones para compartir por WhatsApp o correo.</li>
            <li>Seguimiento del estado de cada cotización (borrador, enviada, aceptada, rechazada).</li>
          </ul>

          <h2>3. Cuenta gratuita</h2>
          <p>
            Rapicot ofrece una cuenta gratuita sin límite de cotizaciones, clientes o productos.
            La empresa se reserva el derecho de introducir planes pagados en el futuro, en cuyo
            caso los usuarios registrados serán informados con al menos 30 días de anticipación.
            Mientras tanto, todas las funcionalidades disponibles son gratuitas.
          </p>

          <h2>4. Responsabilidad del usuario</h2>
          <p>
            <strong>Eres responsable de la exactitud de tus datos.</strong> Esto incluye los datos
            de tu empresa, los de tus clientes y el contenido de cada cotización. Rapicot no valida,
            certifica ni garantiza la veracidad de la información que ingreses.
          </p>
          <p>
            También eres responsable de mantener la confidencialidad de tu contraseña y de todas
            las actividades que ocurran en tu cuenta.
          </p>

          <h2>5. Limitaciones de responsabilidad</h2>
          <p>
            Rapicot se proporciona &ldquo;tal cual&rdquo; y &ldquo;según disponibilidad&rdquo;.
            Hacemos nuestro mejor esfuerzo para que la aplicación funcione correctamente, pero no
            garantizamos que esté libre de errores, interrupciones o fallos de seguridad.
          </p>
          <p>
            Rapicot no es responsable por:
          </p>
          <ul>
            <li>Errores en los cálculos que pudieran derivarse de datos mal ingresados por el usuario.</li>
            <li>Daños o pérdidas derivados del uso o la imposibilidad de usar la aplicación.</li>
            <li>Decisiones comerciales que tomes basadas en cotizaciones generadas con la aplicación.</li>
          </ul>

          <h2>6. Propiedad intelectual</h2>
          <p>
            El nombre, logo, diseño y código de Rapicot son propiedad de sus operadores. Los
            contenidos que generes dentro de la aplicación (cotizaciones, datos de clientes, etc.)
            te pertenecen a ti.
          </p>

          <h2>7. Cancelación y eliminación de cuenta</h2>
          <p>
            Puedes eliminar tu cuenta en cualquier momento desde la sección de perfil. Al hacerlo,
            todos tus datos asociados se eliminarán en un plazo máximo de 30 días.
          </p>
          <p>
            Rapicot se reserva el derecho de suspender o cancelar cuentas que hagan un uso
            indebido del servicio, sin perjuicio de las acciones legales que correspondan.
          </p>

          <h2>8. Legislación aplicable</h2>
          <p>
            Estos términos se rigen por la legislación de la República de Chile. Cualquier
            controversia se someterá a los tribunales de la ciudad de Santiago.
          </p>

          <h2>9. Contacto</h2>
          <p>
            Si tienes dudas sobre estos términos, escríbenos a{' '}
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
