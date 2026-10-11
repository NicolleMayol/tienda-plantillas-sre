# Plan Stripe — Tienda de Plantillas SRE

Guía generada con `stripe_implementation_planner` (cuenta sandbox `acct_1UPBeARw59Yen3HX`, test mode).

## Uso elegido

- **Producto Stripe:** Checkout Sessions, modo `payment` (pago único).
- **UI:** Checkout alojado (`checkout_type: hosted`, `origin_context: web`).
- **Superficie:** navegador web (Next.js 15 App Router).
- **Bienes:** plantillas JSON de Grafana (bienes digitales).
- **Procesador:** solo Stripe (sin otro procesador).
- **Managed Payments / facturas / Payment Links:** no.

Árbol de decisión recorrido:

1. ¿Otro procesador? → No, solo Stripe
2. ¿Dónde se paga? → En el navegador
3. ¿Managed Payments? → No (MVP sin Stripe Tax ni cumplimiento gestionado)
4. ¿Facturas? → No
5. ¿Payment Links? → No
6. Checkout → **hosted** (redirección a la página de Stripe)

Blueprint asociado: `one-time-payment-with-checkout` (`bp_e6690ac7a83a`).

Documentación recomendada:

- [Stripe Checkout (hosted)](https://docs.stripe.com/payments/accept-a-payment?payment-ui=checkout&ui=stripe-hosted)

## Forma de integración

1. El cliente envía `{ items: [{ id, cantidad }] }` a `POST /api/checkout`.
2. El servidor valida el carrito, recalcula precios desde el catálogo en código y crea una Checkout Session (`mode: "payment"`).
3. El cliente redirige a `session.url`.
4. Tras el pago, Stripe redirige a `/exito?session_id={CHECKOUT_SESSION_ID}`.
5. La página de éxito consulta `checkout.sessions.retrieve` y, si `payment_status === "paid"`, muestra descargas.

Cliente Stripe: instancia perezosa (`new Stripe(process.env.STRIPE_SECRET_KEY)`) **dentro** de los handlers, para que `npm run build` no exija la clave.

Variables:

- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_SITE_URL`

## Blueprint original (resumen)

El blueprint sugiere tres capítulos:

1. **setup-chapter:** `POST /v1/products` con `default_price_data`.
2. **checkout-chapter:** `POST /v1/checkout/sessions` con `line_items[].price` apuntando al precio creado, `mode: payment`, `success_url` y `cancel_url`.
3. **webhook-chapter:** cumplir el pedido en `checkout.session.completed`.

## Diferencias respecto a la especificación del MVP

La especificación manda. Donde el plan contradice, se anota aquí:

| Plan / blueprint | Especificación (implementada) |
| --- | --- |
| Crear Producto y Price en Stripe (`POST /v1/products`) | **No** se crean productos en el Dashboard ni por API de catálogo. Precios en `src/data/plantillas.ts` y `price_data` en línea en la Session. |
| `line_items[].price` = ID de Price persistente | `line_items[].price_data` con `currency`, `unit_amount` y `product_data.name`. |
| Cumplir el pedido en webhook `checkout.session.completed` | Confirmación y descargas en `/exito` vía `sessions.retrieve`. El MVP no incluye endpoint de webhooks. |
| Settings de ejemplo con un solo producto y `unit_amount` fijo | Catálogo de 6 plantillas; el total se calcula en servidor según cantidades 1–10. |

Otras decisiones alineadas con buenas prácticas de Stripe y con la spec:

- No se envía `payment_method_types` (métodos dinámicos desde el Dashboard).
- No se confía en precios enviados por el cliente.
- Se etiqueta la Session con `integration_identifier` para el Dashboard.
- Webhooks quedan fuera de este MVP; para producción convendría añadir `checkout.session.completed` y `checkout.session.async_payment_succeeded` para cumplimiento asíncrono.
