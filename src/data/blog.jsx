export const posts = [
  {
    slug: 'errores-comunes-al-cotizar-en-excel',
    title: 'Errores comunes al cotizar en Excel (y cómo evitarlos de una vez)',
    excerpt:
      'Si todavía usas Excel para tus cotizaciones, seguro te ha pasado: fórmulas que se rompen, archivos que se pierden, montos que no cuadran. Te contamos los errores más frecuentes y cómo Rapicot los soluciona.',
    date: '15 junio, 2026',
    author: 'Equipo Rapicot',
    image: null,
    content: (
      <>
        <p>
          Usar Excel para cotizar es como usar un cuchillo de cocina para abrir una lata: se puede,
          pero no es la herramienta correcta y eventualmente te vas a cortar. Si llevas años
          armando cotizaciones en tablas, seguro reconoces alguno de estos errores.
        </p>

        <h2>1. Fórmulas que se rompen sin aviso</h2>
        <p>
          Arrastras una celda, insertas una fila en medio, o copias una hoja a otro libro y —pum— el
          total aparece con #REF o con una referencia a la hoja equivocada. El problema es que nadie
          te avisa. Puedes enviar una cotización con un total errado y darte cuenta una semana
          después.
        </p>
        <p>
          En Rapicot no hay fórmulas. Los montos los calcula el sistema, siempre bien, y tú ves el
          resultado al instante.
        </p>

        <h2>2. El clásico "versión final-final-v3.xlsx"</h2>
        <p>
          Tienes la cotización en el escritorio, otra versión en Dropbox, una que enviaste por correo
          y otra que modificó tu socio. ¿Cuál es la buena? Este problema no es técnico, es de
          proceso. Cuando usas Excel, cada archivo vive su propia vida.
        </p>
        <p>
          Rapicot mantiene una sola versión de cada cotización. Siempre ves la última, y puedes
          saber si está en borrador, enviada, aceptada o rechazada.
        </p>

        <h2>3. IVA mal calculado</h2>
        <p>
          En Chile el IVA es 19%. Pero dependiendo de si el precio que ingresas es neto o bruto,
          el cálculo cambia. Si además aplicas descuentos antes o después del IVA, el resultado
          final puede variar. El margen de error es enorme y las "diferencias de caja" terminan
          saliendo de tu bolsillo.
        </p>
        <p>
          Con Rapicot defines si el precio es neto o bruto y el sistema se encarga del resto.
          Descuentos, subtotales, IVA y total: todo calculado automáticamente.
        </p>

        <h2>4. Datos del cliente incorrectos</h2>
        <p>
          Cada vez que cotizas a un cliente nuevo, escribes su nombre, RUT y dirección. La próxima
          vez, los vuelves a escribir —quizás con una coma de diferencia o una letra cambiada.
          Después te pagan una factura con RUT equivocado y el SII no te la acepta.
        </p>
        <p>
          En Rapicot registras a tu cliente una vez. Las cotizaciones usan esos datos siempre,
          sin errores de tipeo.
        </p>

        <h2>5. Sin respaldo ni orden</h2>
        <p>
          Tu notebook falla, se pierde el archivo, o simplemente no recuerdas cómo se llamaba esa
          cotización de hace tres meses. Excel no tiene historial ni orden: depende de ti mantener
          la carpeta ordenada.
        </p>
        <p>
          Todo lo que creas en Rapicot queda guardado en la nube. Puedes buscar por cliente, por
          fecha o por estado. Y si pierdes tu equipo, tus datos siguen ahí.
        </p>

        <h2>La solución: deja que el software haga lo que sabe hacer</h2>
        <p>
          Excel es una herramienta increíble para muchas cosas, pero no fue diseñado para
          cotizaciones. Cada vez que usas Excel para algo que otro programa hace mejor, estás
          asumiendo un riesgo innecesario.
        </p>
        <p>
          Rapicot no te quita el control: te quita los errores. Pruébalo gratis y haz tu primera
          cotización en menos de 5 minutos.
        </p>
      </>
    ),
  },
  {
    slug: 'como-calcular-el-iva-en-una-cotizacion',
    title: 'Cómo calcular el IVA en una cotización (sin equivocarte)',
    excerpt:
      'Calcular el IVA parece simple, pero en la práctica miles de pymes pierden plata por errores al hacerlo. Te explicamos cómo funciona y cómo automatizarlo.',
    date: '22 junio, 2026',
    author: 'Equipo Rapicot',
    image: null,
    content: (
      <>
        <p>
          El IVA (Impuesto al Valor Agregado) es del 19% en Chile y se aplica a la venta de la
          mayoría de productos y servicios. Parece sencillo: multiplicas por 0,19 y listo. Pero
          cuando empiezas a manejar descuentos, precios con y sin IVA, y múltiples líneas de
          productos, las cosas se complican.
        </p>

        <h2>Lo básico: neto, IVA y total</h2>
        <p>
          Una cotización tiene tres valores clave:
        </p>
        <ul>
          <li>
            <strong>Neto:</strong> el valor del producto o servicio sin IVA. Ejemplo: $100.000.
          </li>
          <li>
            <strong>IVA:</strong> el 19% del neto. En este caso, $19.000.
          </li>
          <li>
            <strong>Total:</strong> neto + IVA. Acá serían $119.000.
          </li>
        </ul>
        <p>
          La fórmula es simple: <strong>Total = Neto × 1,19</strong>. Si trabajas con precios
          que ya incluyen IVA, puedes obtener el neto dividiendo por 1,19: <strong>Neto =
          Total ÷ 1,19</strong>.
        </p>

        <h2>El error más común: aplicar descuento antes del IVA</h2>
        <p>
          Supón que vendes un servicio en $200.000 neto y ofreces un 10% de descuento. El orden
          correcto es:
        </p>
        <ol>
          <li>Neto original: $200.000</li>
          <li>Descuento (10%): -$20.000</li>
          <li>Neto con descuento: $180.000</li>
          <li>IVA (19%): +$34.200</li>
          <li>Total final: $214.200</li>
        </ol>
        <p>
          Si aplicas el descuento después del IVA (al total), terminas descontando también parte
          del impuesto, lo que no corresponde. El descuento se aplica al valor del producto, no al
          impuesto.
        </p>

        <h2>Productos exentos y no afectos</h2>
        <p>
          No todo paga IVA. Algunos productos y servicios están exentos (como la salud o la
          educación) o no afectos (como la exportación de servicios). Si trabajas con este tipo
          de ítems, debes indicarlo en la cotización para no cobrar IVA de más.
        </p>
        <p>
          En Rapicot puedes marcar productos como exentos y el sistema ajusta el cálculo
          automáticamente, sin que tengas que acordarte.
        </p>

        <h2>Automatiza y olvídate</h2>
        <p>
          La buena noticia es que no necesitas recordar todas estas reglas. Un buen software de
          cotizaciones las aplica por ti. En Rapicot solo ingresas los productos, cantidades y
          descuentos; el IVA, subtotales y totales los calcula el sistema al instante.
        </p>
        <p>
          Así reduces errores, evitas diferencias de caja y presentas una cotización profesional
          que tu cliente puede entender y pagar sin dudas.
        </p>
      </>
    ),
  },
  {
    slug: 'que-debe-incluir-una-cotizacion-profesional',
    title: 'Qué debe incluir una cotización profesional (lista completa)',
    excerpt:
      'Una cotización no es solo un precio: es tu carta de presentación. Esto es lo que no puede faltar para que te tomen en serio.',
    date: '29 junio, 2026',
    author: 'Equipo Rapicot',
    image: null,
    content: (
      <>
        <p>
          Una cotización profesional no es un papel con un número. Es la primera impresión formal
          que tu cliente tiene de tu negocio. Una cotización bien hecha transmite orden,
          seriedad y confianza. Una mal hecha —aunque el precio sea bueno— puede hacer que el
          cliente elija a otro.
        </p>
        <p>
          Esto es lo que debería incluir todo documento de cotización, sin excepción.
        </p>

        <h2>1. Datos de tu empresa</h2>
        <p>
          Nombre legal o nombre de fantasía, RUT, dirección, teléfono y correo electrónico. Si
          tienes logo, úsalo. Tu cliente necesita saber quién le está cobrando y a quién debe
          pagar.
        </p>

        <h2>2. Datos del cliente</h2>
        <p>
          Nombre o razón social, RUT y dirección del cliente. Si la cotización es para una
          empresa, estos datos son necesarios para emitir una factura más adelante. Si faltan,
          tendrás que pedirlos después y el proceso se traba.
        </p>

        <h2>3. Número de cotización y fecha</h2>
        <p>
          Cada cotización debe tener un identificador único. Puede ser correlativo (COT-001,
          COT-002…) o incluir la fecha (COT-2026-001). La fecha de emisión es indispensable para
          definir la vigencia de la oferta.
        </p>

        <h2>4. Descripción detallada de los productos o servicios</h2>
        <p>
          No pongas solo "Servicios de consultoría". Sé específico: "Consultoría en marketing
          digital — 3 meses — incluye auditoría inicial, plan de medios y reportes mensuales".
          Mientras más claro seas, menos objeciones tendrás después.
        </p>
        <p>
          Incluye para cada ítem: cantidad, unidad (horas, unidades, metros), precio unitario y
          subtotal por línea.
        </p>

        <h2>5. Descuentos (si aplican)</h2>
        <p>
          Si ofreces un descuento, muéstralo de forma explícita. No lo "escondas" en el precio
          final. Ver el descuento aplicado genera una sensación de valor en el cliente y hace
          más transparente la negociación.
        </p>

        <h2>6. Subtotal, IVA y total</h2>
        <p>
          Desglosa los montos:
        </p>
        <ul>
          <li>Subtotal: suma de todos los productos antes de impuestos.</li>
          <li>Descuento: monto total descontado (si aplica).</li>
          <li>Neto: subtotal menos descuento.</li>
          <li>IVA (19%): calculado sobre el neto.</li>
          <li>Total final: neto más IVA.</li>
        </ul>
        <p>
          Este desglose es clave para que el cliente entienda qué está pagando y por qué.
        </p>

        <h2>7. Condiciones de pago</h2>
        <p>
          ¿Se paga al contado, contra entrega, a 30 días? ¿Aceptas transferencia, tarjeta o
          efectivo? Déjalo claro para evitar malentendidos después.
        </p>

        <h2>8. Validez de la oferta</h2>
        <p>
          "Precios válidos por 15 días desde la fecha de emisión." Esto protege tu margen ante
          cambios en tus costos y le pone urgencia al cliente para decidir.
        </p>

        <h2>9. Tiempo de entrega</h2>
        <p>
          ¿Cuándo empiezas y cuándo entregas? Incluye plazos estimados para que el cliente sepa
          qué esperar. Si hay hitos intermedios, menciónalos.
        </p>

        <h2>10. Firma o sello</h2>
        <p>
          Un espacio para tu firma digital, logo o sello de la empresa le da el toque final de
          formalidad. En Rapicot cada cotización se genera con los datos de tu empresa y tu logo,
          lista para enviar.
        </p>

        <h2>Hazlo simple, hazlo profesional</h2>
        <p>
          No necesitas un documento de 10 páginas. Una cotización profesional es clara, completa
          y fácil de leer. Con estos 10 elementos tienes todo lo necesario para que te tomen en
          serio.
        </p>
        <p>
          En Rapicot puedes crear una cotización con todos estos elementos en menos de 5 minutos.
          Pruébalo gratis, sin compromiso.
        </p>
      </>
    ),
  },
]
