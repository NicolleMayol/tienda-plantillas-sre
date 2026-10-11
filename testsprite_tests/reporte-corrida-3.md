
# TestSprite AI Testing Report(MCP)

---

## 1️⃣ Document Metadata
- **Project Name:** tienda-plantillas-sre
- **Date:** 2026-10-10
- **Prepared by:** TestSprite AI Team

---

## 2️⃣ Requirement Validation Summary

#### Test TC001 Completar la confirmación de pago con sesión válida
- **Test Code:** [TC001_Completar_la_confirmacin_de_pago_con_sesin_vlida.py](./TC001_Completar_la_confirmacin_de_pago_con_sesin_vlida.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/1deda030-04e2-525f-94b8-580a46d536f2/test/efee9881-d4c2-494b-b310-529dc246b37a
- **Status:** ✅ Passed
- **Analysis / Findings:** Checkout con 4242… llegó a /exito?session_id=. Solo valida la URL.
---

#### Test TC002 Completar la compra y llegar a la página de éxito
- **Test Code:** [TC002_Completar_la_compra_y_llegar_a_la_pgina_de_xito.py](./TC002_Completar_la_compra_y_llegar_a_la_pgina_de_xito.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/1deda030-04e2-525f-94b8-580a46d536f2/test/205f86d5-35d5-45d7-a68a-5040099296fe
- **Status:** ✅ Passed
- **Analysis / Findings:** Compra completa hasta /exito. Solo valida la URL.
---

#### Test TC003 Revisar el carrito con artículos guardados
- **Test Code:** [TC003_Revisar_el_carrito_con_artculos_guardados.py](./TC003_Revisar_el_carrito_con_artculos_guardados.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/1deda030-04e2-525f-94b8-580a46d536f2/test/b8d00a39-d5e7-4d69-9a40-bc69c2e44899
- **Status:** ✅ Passed
- **Analysis / Findings:** Carrito con artículos guardados correcto.
---

#### Test TC004 Explorar categorías y agregar una plantilla desde el catálogo
- **Test Code:** [TC004_Explorar_categoras_y_agregar_una_plantilla_desde_el_catlogo.py](./TC004_Explorar_categoras_y_agregar_una_plantilla_desde_el_catlogo.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/1deda030-04e2-525f-94b8-580a46d536f2/test/6ce40e7f-50f5-40ce-855e-ce1b279a18df
- **Status:** ✅ Passed
- **Analysis / Findings:** Filtro por categoría y agregado desde catálogo correctos.
---

#### Test TC005 Ajustar cantidades y ver el total del carrito
- **Test Code:** [TC005_Ajustar_cantidades_y_ver_el_total_del_carrito.py](./TC005_Ajustar_cantidades_y_ver_el_total_del_carrito.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/1deda030-04e2-525f-94b8-580a46d536f2/test/149bffb6-578b-417c-b911-ad48c4870902
- **Status:** ✅ Passed
- **Analysis / Findings:** Cantidades y total correctos.
---

#### Test TC006 Cambiar cantidades en el carrito y ver el total actualizado
- **Test Code:** [TC006_Cambiar_cantidades_en_el_carrito_y_ver_el_total_actualizado.py](./TC006_Cambiar_cantidades_en_el_carrito_y_ver_el_total_actualizado.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/1deda030-04e2-525f-94b8-580a46d536f2/test/01e42578-cf00-4ba7-8959-8ab5f4d601fc
- **Status:** ✅ Passed
- **Analysis / Findings:** Cantidades y total correctos.
---

#### Test TC007 Agregar una plantilla al carrito desde el catálogo
- **Test Code:** [TC007_Agregar_una_plantilla_al_carrito_desde_el_catlogo.py](./TC007_Agregar_una_plantilla_al_carrito_desde_el_catlogo.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/1deda030-04e2-525f-94b8-580a46d536f2/test/117af471-9efe-4b76-91ac-7c90cbfd2a86
- **Status:** ✅ Passed
- **Analysis / Findings:** Agregar desde catálogo incrementa el contador.
---

#### Test TC008 Eliminar artículos hasta vaciar el carrito
- **Test Code:** [TC008_Eliminar_artculos_hasta_vaciar_el_carrito.py](./TC008_Eliminar_artculos_hasta_vaciar_el_carrito.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/1deda030-04e2-525f-94b8-580a46d536f2/test/f8f54a58-b71e-42b9-ab4f-7c26e4b5b208
- **Status:** ✅ Passed
- **Analysis / Findings:** Quitar ítems hasta vaciar muestra carrito vacío.
---

#### Test TC009 Eliminar un artículo del carrito
- **Test Code:** [TC009_Eliminar_un_artculo_del_carrito.py](./TC009_Eliminar_un_artculo_del_carrito.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/1deda030-04e2-525f-94b8-580a46d536f2/test/85dc5c2a-60c2-4f6d-8112-dea92d2700ab
- **Status:** ✅ Passed
- **Analysis / Findings:** Quitar un ítem correcto.
---

#### Test TC010 Cancelar el pago y conservar el carrito
- **Test Code:** [TC010_Cancelar_el_pago_y_conservar_el_carrito.py](./TC010_Cancelar_el_pago_y_conservar_el_carrito.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/1deda030-04e2-525f-94b8-580a46d536f2/test/01288380-5ae1-4651-833f-b012d19a7472
- **Status:** ✅ Passed
- **Analysis / Findings:** Cancelar en Stripe vuelve a /cancelado y conserva el carrito.
---

#### Test TC011 Abrir el detalle de una plantilla y agregarla al carrito
- **Test Code:** [TC011_Abrir_el_detalle_de_una_plantilla_y_agregarla_al_carrito.py](./TC011_Abrir_el_detalle_de_una_plantilla_y_agregarla_al_carrito.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/1deda030-04e2-525f-94b8-580a46d536f2/test/a96c16bb-1918-4307-b954-7920c8374e65
- **Status:** ✅ Passed
- **Analysis / Findings:** Detalle y agregado correctos.
---

#### Test TC012 Ver una confirmación válida y acceder a las descargas
- **Test Code:** [TC012_Ver_una_confirmacin_vlida_y_acceder_a_las_descargas.py](./TC012_Ver_una_confirmacin_vlida_y_acceder_a_las_descargas.py)
- **Test Error:** TEST FAILURE

The success page did not show a payment confirmation or downloadable files for a supposed paid session — an error message was shown instead.

Observations:
- The page headline displays "No pudimos confirmar tu pago".
- No purchased total or order summary is visible on the page.
- No download links or files are present; only a "Volver al carrito" link is shown.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/1deda030-04e2-525f-94b8-580a46d536f2/test/58685958-8214-4f0d-b4e1-d1613331473e
- **Status:** ❌ Failed
- **Analysis / Findings:** Falso negativo del test: abre /exito sin session_id (la herramienta regeneró el test; antes usaba un id inventado), por lo que la app muestra correctamente 'No pudimos confirmar tu pago'. No es un bug de la app.
---

#### Test TC013 Explorar plantillas por categoría y abrir un detalle
- **Test Code:** [TC013_Explorar_plantillas_por_categora_y_abrir_un_detalle.py](./TC013_Explorar_plantillas_por_categora_y_abrir_un_detalle.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/1deda030-04e2-525f-94b8-580a46d536f2/test/fb536b89-7d13-44fd-a831-379dffbcc93a
- **Status:** ✅ Passed
- **Analysis / Findings:** Navegación por categoría y detalle correctas.
---

#### Test TC014 Conservar el carrito al cancelar el checkout
- **Test Code:** [TC014_Conservar_el_carrito_al_cancelar_el_checkout.py](./TC014_Conservar_el_carrito_al_cancelar_el_checkout.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/1deda030-04e2-525f-94b8-580a46d536f2/test/bc4abc9d-957e-49e6-8278-f713176c5be6
- **Status:** ✅ Passed
- **Analysis / Findings:** El carrito se conserva tras cancelar.
---

#### Test TC015 Agregar una plantilla al carrito desde el detalle
- **Test Code:** [TC015_Agregar_una_plantilla_al_carrito_desde_el_detalle.py](./TC015_Agregar_una_plantilla_al_carrito_desde_el_detalle.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/1deda030-04e2-525f-94b8-580a46d536f2/test/e50b7130-2673-40d4-bdd1-5016eae1ee42
- **Status:** ✅ Passed
- **Analysis / Findings:** Agregar desde el detalle correcto.
---


## 3️⃣ Coverage & Matching Metrics

- **93.33%** pasaron (14/15). Mismo resultado que la corrida 1.

| Requisito | Total | ✅ | ❌ |
|---|---|---|---|
| Catálogo y detalle (TC004, 007, 011, 013, 015) | 5 | 5 | 0 |
| Carrito (TC003, 005, 006, 008, 009) | 5 | 5 | 0 |
| Checkout y páginas de resultado (TC001, 002, 010, 012, 014) | 5 | 4 | 1 |

---

## 4️⃣ Key Gaps / Risks
- TC012 falla por diseño del test (sin session_id válido), no por la app. Para validar la rama 'pagado' hace falta una sesión real de Stripe o reemplazar el test.
- Ningún test aserta el texto del aria-label del carrito ("1 artículo"), así que esta corrida no verifica el cambio de singular; la app sí lo contiene (Encabezado.tsx:18).
- TC001/TC002 solo validan la URL de /exito. No se cubren tarjeta rechazada, 3D Secure, errores 400 de /api/checkout ni /api/health.
- La herramienta regeneró los archivos TC*.py en cada corrida (aparecen modificados en git).
