# Prompt para Cursor
Antes de escribir código, usa la herramienta `stripe_implementation_planner` del MCP de Stripe con este
contexto y guarda el plan que devuelva en `docs/plan-stripe.md`. Después construye la app según la
especificación de abajo. Si el plan contradice la especificación, manda la especificación y anota la
diferencia al final de `docs/plan-stripe.md`. Mantén `price_data` en línea y los precios en el catálogo
del código; no crees productos en el Dashboard de Stripe.

Crea un MVP llamado "Tienda de Plantillas SRE": una tienda donde un equipo de SRE compra
plantillas de dashboards de Grafana y paga con Stripe en modo prueba.

## Stack
- Next.js 15 (App Router) + TypeScript + Tailwind CSS.
- SDK oficial `stripe` (Node). Solo Stripe Checkout alojado, sin formularios de tarjeta propios.
- Vitest para pruebas unitarias.
- Node 22. El servidor de desarrollo corre en el puerto 3000.

## Catálogo
- Archivo `src/data/plantillas.ts` con 6 plantillas: id, nombre, descripción, categoría,
  precio en centavos de USD y nombre del archivo JSON.
- Plantillas: "Kubernetes Cluster Overview" (Kubernetes, 1500), "PostgreSQL Health" (Bases de datos, 1200),
  "Node Exporter Full" (Infraestructura, 900), "SLO Burn Rate" (SLO, 2000),
  "NGINX Ingress" (Kubernetes, 1100), "Blackbox Probes" (Disponibilidad, 800).
- Por cada plantilla, un JSON de dashboard de Grafana sencillo pero válido en `public/plantillas/<id>.json`.

## Páginas y flujo
1. `/` Catálogo: tarjetas con nombre, categoría, precio y botón "Agregar al carrito".
   Filtro por categoría. Contador del carrito en el encabezado.
2. `/plantillas/[id]`: detalle de la plantilla. Si el id no existe, página 404.
3. `/carrito`: lista de ítems, cambiar cantidad (1 a 10), quitar ítem, total y botón "Pagar con Stripe".
   Carrito vacío: mensaje "Tu carrito está vacío" y el botón de pago deshabilitado.
   El carrito vive en un React Context y se guarda en localStorage.
4. `POST /api/checkout`: recibe `{ items: [{ id, cantidad }] }`.
   - Valida con una función pura `validarCarrito` en `src/lib/carrito.ts`:
     carrito vacío, id desconocido o cantidad fuera de 1..10 responde 400 con `{ error }`.
   - Recalcula precios en el servidor desde el catálogo. Nunca confíes en precios enviados por el cliente.
   - Crea una Checkout Session (`mode: "payment"`, `price_data` en línea) con
     `success_url = {SITE_URL}/exito?session_id={CHECKOUT_SESSION_ID}` y `cancel_url = {SITE_URL}/cancelado`.
   - Responde `{ url }` y el cliente redirige a esa URL.
5. `/exito`: componente de servidor que consulta la sesión con `stripe.checkout.sessions.retrieve`.
   Si `payment_status === "paid"`: muestra "Pago confirmado", el total y un enlace de descarga
   por cada plantilla comprada; además vacía el carrito.
   Si falta el session_id o la sesión no existe o no está pagada: muestra "No pudimos confirmar tu pago".
6. `/cancelado`: "Pago cancelado", el carrito se conserva y hay un enlace para volver al carrito.
7. `GET /api/health`: responde 200 con `{ "status": "ok" }`.

## Reglas técnicas
- Crea el cliente de Stripe de forma perezosa, dentro de los handlers, para que `npm run build`
  funcione sin la clave real.
- Variables: `STRIPE_SECRET_KEY` y `NEXT_PUBLIC_SITE_URL`. Crea `.env.example` sin valores reales.
  `.env.local` debe estar en `.gitignore`.
- Funciones puras en `src/lib/carrito.ts`: `calcularTotal`, `validarCarrito`, `formatearPrecio`.
  Pruebas unitarias en Vitest para las tres, con casos límite (cantidad 0, 11, id inexistente, carrito vacío).
- Agrega `data-testid` a los elementos clave: `tarjeta-plantilla`, `btn-agregar`, `contador-carrito`,
  `item-carrito`, `input-cantidad`, `btn-quitar`, `total-carrito`, `btn-pagar`, `mensaje-exito`,
  `mensaje-error-pago`, `filtro-categoria`.
- Botones y campos con etiquetas accesibles (`aria-label` o `<label>`).
- Scripts en package.json: `dev`, `build`, `start`, `lint`, `test` (vitest run).
- No crees workflows de GitHub Actions; ya tengo uno.
- README corto: cómo correrlo y las tarjetas de prueba de Stripe
  (4242 4242 4242 4242 aprobada, 4000 0000 0000 0002 rechazada, 4000 0025 0000 3155 con 3D Secure).

Cuando termines, corre `npm run lint`, `npm test` y `npm run build`, y corrige lo que falle.
