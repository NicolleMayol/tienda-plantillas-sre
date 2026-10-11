# Reporte corrida 5 (TC020, TC012, TC001)

Fecha: 2026-10-10 · App reiniciada con las descargas protegidas (`/api/descargas/[id]?session_id=…`), `public/plantillas/` eliminado. App sin modificar por mí.

**Resultado: 3 de 3 pasaron.** Pero la fuerza de cada verde es distinta:

| Caso | Estado | Qué comprueba realmente el script |
|---|---|---|
| TC020 Descarga sin pagar | ✅ | Abre `/plantillas/kubernetes-cluster-overview.json` y verifica que se muestra el enlace "Volver al catálogo" (página de error). Antes (corrida 4b) esa URL entregaba el JSON y el test fallaba. **Confirma que la URL antigua ya no entrega la plantilla.** No prueba directamente `/api/descargas/…`. |
| TC012 Checkout real 4242 | ✅ | Checkout real hasta `/exito?session_id=` y enlace "Descargar Kubernetes Cluster…" visible. **No verifica "Pago confirmado" ni el href del enlace** (la versión de la corrida 4 sí verificaba el href; el href viejo ya no existe y la nueva versión generada no lo comprueba). **No descarga el archivo.** |
| TC001 Pago aprobado | ✅ | Checkout real hasta `/exito?session_id=` y contador del carrito en 0. **No verifica "Pago confirmado", el total ni el enlace "Descargar"** como pide el plan. |

## Verificación adicional (curl, solo lectura, contra el servidor en marcha)
- `GET /plantillas/kubernetes-cluster-overview.json` → 404 (antes 200).
- `GET /api/descargas/kubernetes-cluster-overview` sin `session_id` → 401.

## Lo que sigue sin probarse
- Que el enlace "Descargar" de una compra real devuelva el JSON correcto (flujo feliz de `/api/descargas`).
- Que `/api/descargas` rechace una sesión pagada que **no incluye** esa plantilla, o un `session_id` inválido.
- "Pago confirmado" y el total en `/exito` (TC001/TC002/TC012 siguen sin asertarlos; el generador de TestSprite omite esas aserciones del plan).
