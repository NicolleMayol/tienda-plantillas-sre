# Reporte corrida 4b (TC016–TC020)

Fecha: 2026-10-10 · Servidor en modo development · App sin modificar.

**Resultado: 4 pasaron, 1 falló (TC020). De los 4 verdes, solo TC016 es una verificación sólida.**

| Caso | Estado | Qué comprueba realmente el código generado |
|---|---|---|
| TC016 Tarjeta rechazada | ✅ | Sólido: Stripe muestra "Your credit card was declined…" y la URL no contiene `/exito`. |
| TC017 3D Secure | ✅ (no confiable) | La única aserción es `assert current_url` (la URL no está vacía). **No verifica "Pago confirmado"** ni que se llegó a `/exito`. |
| TC018 /exito sin session_id | ✅ (no confiable) | Navega a `/exito` pero solo aserta `assert current_url`. **No verifica "No pudimos confirmar tu pago".** |
| TC019 /plantillas/no-existe | ✅ (débil) | Aserta la URL y el texto "Volver al catálogo" mediante un **XPath absoluto** (`/html/body/main/section/a`), lo que el plan prohibía. No verifica el texto de 404 explícitamente. |
| TC020 Descarga sin pagar | ❌ | Falla. Ver abajo. |

## Qué falló y por qué: TC020
`/plantillas/kubernetes-cluster-overview.json` se sirve sin pagar. El test vio el JSON del dashboard (`"title": "Kubernetes Cluster Overview"`, array `panels`). Es un **hallazgo real de la app**, no un fallo del test: las 6 plantillas están en `public/plantillas/`, que Next.js sirve de forma pública, así que cualquiera con la URL las descarga sin comprar (HTTP 200 confirmado con curl). El enlace "Descargar" de `/exito` no protege nada. No modifiqué la app.

Posible arreglo (para decidir tú): sacar los JSON de `public/` y servirlos desde una ruta que verifique la sesión de Stripe pagada.

## Notas
- TC017 y TC018 en verde no prueban lo que dicen; conviene reforzarlos (aserciones explícitas sobre `mensaje-exito` / `mensaje-error-pago`) y reejecutarlos.
- Primera vez que se ejecutan TC016–TC020 (en la corrida 4 no corrieron por el límite de 15 en modo dev). Se lanzaron solos esta vez, por eso no hubo tope.
