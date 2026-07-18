Estoy construyendo un MVP de un sistema de cotizaciones/presupuestos para pymes chilenas.

CONTEXTO DEL PRODUCTO
Es una herramienta web simple para que una pyme cree cotizaciones profesionales
para sus clientes, en vez de usar Excel o Word. No emite documentos tributarios
(no es facturación electrónica, no requiere certificación SII). El IVA que se
muestra es solo informativo/referencial.

USUARIO OBJETIVO
Pyme chilena pequeña (1-5 personas), dueño o vendedor que cotiza directamente
a sus clientes. Bajo nivel técnico: la interfaz debe ser extremadamente simple,
sin jerga, en español, pensada para usarse desde el celular también.

ALCANCE DEL MVP (solo esto, nada más por ahora)
1. Login simple: 1 usuario = 1 empresa (sin roles ni multiusuario todavía).
2. CRUD de clientes (nombre, RUT opcional, email, teléfono, dirección).
3. CRUD de catálogo de productos/servicios (nombre, descripción, precio unitario, unidad).
4. Constructor de cotización: seleccionar cliente, agregar ítems del catálogo
   (o ítems libres), cantidad, descuento por ítem, cálculo automático de IVA (19%)
   y total.
5. Exportar la cotización a PDF con logo de la empresa y datos de contacto.
6. Botón de enviar por WhatsApp (link wa.me) y por correo (mailto: o envío simple).
7. Estado de cotización: Borrador / Enviada / Aceptada / Rechazada, editable manualmente
   por el usuario.
8. Listado de cotizaciones con filtro por estado y cliente.

FUERA DE ALCANCE (no construir esto todavía, aunque parezca fácil de agregar)
- Integración con facturadores electrónicos (Bsale, Defontana, etc.)
- Multiusuario, roles y permisos
- Firma electrónica o aceptación digital del cliente
- Reportes avanzados o dashboards analíticos
- App móvil nativa
- Notificaciones automáticas o recordatorios programados

STACK TÉCNICO
- Frontend: React con Next.js (App Router)
- Backend y base de datos: Supabase (Postgres + Auth + Storage)
- Estilos: Tailwind CSS
- Generación de PDF: librería del lado del cliente o servidor, la que sea
  más simple de implementar (no optimizar prematuramente)
- Deploy: Vercel

PRINCIPIOS QUE QUIERO QUE SIGAS
- Prioriza simplicidad y velocidad de entrega sobre arquitectura "perfecta".
  Este es un MVP para validar con usuarios reales, no un producto final.
- Interfaz en español, textos claros, sin tecnicismos.
- Mobile-first: la mayoría de mis usuarios piloto van a probarlo desde el celular.
- Cada funcionalidad debe quedar usable de punta a punta antes de pasar a la
  siguiente (no dejes pantallas a medio construir).
- Explícame brevemente las decisiones técnicas importantes que tomes, pero no
  me des clases teóricas largas — soy estudiante de Ingeniería en Informática,
  ya manejo lo básico de React y bases de datos.

Confirma que entendiste el contexto completo antes de que te pida la primera
funcionalidad específica.