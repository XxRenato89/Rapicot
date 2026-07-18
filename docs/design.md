El dashboard de Rapicot ya está construido y funciona, pero visualmente es
genérico: se ve como cualquier panel de administración por defecto (sidebar
o topbar estándar, tablas simples sin personalidad, tarjetas de formulario
básicas, modales default del framework de estilos). Quiero que lo rediseñes
por completo con la misma dirección visual distintiva que ya definimos para
la landing y el login de Rapicot — deben sentirse como el mismo producto,
no como dos apps distintas.

CONTEXTO DEL PRODUCTO
Rapicot es una herramienta para que pymes chilenas dejen de cotizar en
Excel. El dashboard es donde el usuario pasa la mayor parte del tiempo real
(a diferencia de la landing, que solo se ve una vez). Acá la prioridad es
que sea rápido de usar y agradable en uso repetido — no solo bonito en la
primera impresión.

PANTALLAS Y COMPONENTES A CUBRIR (todo lo que existe hoy en la app)
- Listado de cotizaciones (con resumen/métricas arriba, filtros por estado
  y cliente, indicador de vencidas)
- Constructor/detalle de cotización (selección de cliente, ítems, cálculo
  de totales, notas, estado, botones de enviar/duplicar/exportar PDF)
- Vista pública de cotización (la que ve el cliente final, sin login)
- Listado y formulario de Clientes
- Listado y formulario de Catálogo
- Pantalla "Mi empresa" (datos, logo, respaldo de datos)
- Papelera (cotizaciones eliminadas)
- Vista de calificaciones recibidas
- Checklist de primeros pasos (onboarding)
- Modal de calificación con estrellas
- Importador de Excel/CSV (modal con preview y mapeo de columnas)
- Todos los modales de crear/editar (cliente, ítem de catálogo, ítem de
  cotización) y de confirmación (eliminar, restaurar)
- Estados vacíos, estados de carga, notificaciones/toasts
- Navegación principal entre todas estas secciones

LO QUE QUIERO QUE HAGAS (proceso, no solo resultado)

1. Antes de escribir código, define y muéstrame primero:
   - Cómo se extiende el sistema de diseño de la landing (paleta, tipografía,
     elemento firma) a un contexto de "herramienta de trabajo": qué se
     mantiene igual y qué se adapta para dar más densidad de información
     sin perder personalidad.
   - Un concepto de navegación (no asumas automáticamente sidebar oscuro
     genérico ni topbar genérico — elige el que mejor sirva a este producto
     y justifica por qué).
   - Cómo se ven los estados: normal, hover, foco de teclado, vacío, carga,
     error — como un mini sistema, no resuelto pantalla por pantalla de
     forma inconsistente.
   - El patrón de modal/panel que usarás para crear/editar registros (modal
     centrado clásico, panel lateral deslizante, u otro) y por qué es mejor
     para este caso de uso (formularios frecuentes y rápidos, no
     configuraciones complejas).

2. Evita explícitamente el patrón de "panel de admin por defecto": sidebar
   azul-marino o gris oscuro con íconos outline blancos, tarjetas de
   métricas idénticas en fila con un número grande y una flechita de
   tendencia, tablas con zebra-striping estándar de cualquier librería de
   componentes sin personalizar.

3. Prioriza la eficiencia de uso repetido sobre el impacto visual de primera
   impresión: menos clics para tareas frecuentes (crear cotización, agregar
   cliente al vuelo desde el cotizador), atajos claros, feedback inmediato
   de cada acción (guardado, error, éxito).

4. Todos los formularios de creación/edición deben poder abrirse sin perder
   el contexto de dónde estaba el usuario (por ejemplo, crear un cliente
   nuevo desde dentro del cotizador sin salir de la pantalla de cotización).

5. Asegura consistencia total: mismo estilo de botones, inputs, tablas,
   badges de estado, y modales en todas las secciones — no un estilo por
   pantalla.

6. Debe ser completamente responsive, pensado mobile-first ya que muchos
   usuarios entrarán desde el celular, incluyendo cómo se comporta la
   navegación y las tablas (que no se rompan ni obliguen a scroll horizontal
   incómodo) en pantallas chicas.

7. Mantén accesibilidad: foco de teclado visible, contraste adecuado,
   tamaños de texto legibles, estados de error de formulario claros y
   asociados a su campo.

Muéstrame primero el sistema de diseño extendido y el concepto de
navegación/modales en texto, antes de escribir el código completo de cada
pantalla, para que pueda darte feedback antes de que reconstruyas todo el
dashboard.