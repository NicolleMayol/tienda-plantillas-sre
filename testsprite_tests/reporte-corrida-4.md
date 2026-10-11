# Reporte corrida 4

Fecha: 2026-10-10 · Plan editado: `testsprite_frontend_test_plan.json` (TC001, 002, 004, 005, 006, 012 corregidos; TC016–TC020 reemplazados por los casos nuevos).

## Resultado: ejecución INCOMPLETA — 15 de 20 casos

TestSprite pidió TC001–TC020, pero el servidor corre en modo **development** y la herramienta limita a **15 pruebas** en ese modo (30 en producción). Se ejecutaron TC001–TC015. **TC016–TC020 (tarjeta rechazada, 3D Secure, /exito sin session_id, 404, descarga sin pagar) NO se ejecutaron**, así que no hay resultado para ellos.

| Caso | Estado | Nota |
|---|---|---|
| TC001 | ✅ | El script solo aserta URL `/exito?session_id=` y carrito en 0. **No verifica "Pago confirmado", ni el total, ni "Descargar"** como pedía el plan. |
| TC002 | ✅ | Aserta URL y enlace "Descargar Kubernetes Cluster…". **Falta "Pago confirmado" y total.** |
| TC003 | ✅ | |
| TC004 | ✅ | Selecciona Kubernetes, ve Kubernetes Cluster Overview y NGINX Ingress, y "Carrito (1)". **No verifica que las demás categorías desaparezcan.** |
| TC005 | ✅ | Solo aserta el valor de `input-cantidad` (3). **No aserta `total-carrito`.** |
| TC006 | ✅ | Solo aserta `input-cantidad` (2). **No aserta `total-carrito`.** |
| TC007–TC011, TC013–TC015 | ✅ | |
| TC012 | ✅ | Checkout real con 4242 (sin session_id inventado); aserta URL, "Descargar" y href `/plantillas/kubernetes-cluster-overview.json`. **Falta "Pago confirmado".** |
| TC016–TC020 | ⏸ No ejecutados | Límite de 15 en modo dev. |

## Qué falló y por qué
Ninguna prueba ejecutada falló (15/15), pero **el verde no es confiable** para TC001, TC002, TC004, TC005, TC006 y TC012: el generador de TestSprite no tradujo todas las aserciones del plan a código (ver notas). Esos casos no demuestran lo que el plan pretendía.

## Riesgo a vigilar en TC020 (no ejecutado)
`curl localhost:3002/plantillas/kubernetes-cluster-overview.json` devuelve **HTTP 200**: los JSON están en `public/plantillas/` y se sirven a cualquiera sin pagar. Se espera que TC020 falle cuando se ejecute (hallazgo real de la app, que no modifiqué).

## Otros
- Cada corrida deja los `TC*.py` anteriores y crea los nuevos con otro nombre (19 archivos `TC0*.py` ahora); hay duplicados obsoletos.
- Para completar: reiniciar el servidor en producción (`npm run build && npm start`, puerto 3002) y volver a ejecutar TC001–TC020.
