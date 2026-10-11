# Tienda de Plantillas SRE

MVP para comprar plantillas JSON de dashboards de Grafana y pagar con Stripe Checkout en modo prueba.

## Requisitos

- Node 22
- Cuenta Stripe en modo test (sandbox)

## Cómo correrlo

```bash
cp .env.example .env.local
```

Completa `STRIPE_SECRET_KEY` (clave de prueba `sk_test_...`) y deja `NEXT_PUBLIC_SITE_URL=http://localhost:3000`.

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

Otros scripts:

```bash
npm test
npm run lint
npm run build
npm start
```

## Tarjetas de prueba de Stripe

Usa cualquier fecha futura y un CVC de 3 dígitos.

| Número | Resultado |
| --- | --- |
| `4242 4242 4242 4242` | Pago aprobado |
| `4000 0000 0000 0002` | Pago rechazado |
| `4000 0025 0000 3155` | Requiere 3D Secure |

Más tarjetas: [documentación de pruebas de Stripe](https://docs.stripe.com/testing).
