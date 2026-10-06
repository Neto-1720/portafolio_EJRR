# Mini demos

Cinco pruebas cortas. El case study cuenta la decisión. La demo enseña un recorte funcional. El enlace sale de `web/src/features/demos/catalog.ts`, un solo mapa entre proyecto y ruta.

Los datos son ficticios. No hay clientes, transportistas, mensajes ni entregas reales.

## Rutas

| Ruta | Proyecto | Qué demuestra | Qué es funcional | Qué está simulado |
|---|---|---|---|---|
| `/demo/logistics` | `saas-logistics-platform` | React, TypeScript, API Laravel, filtros y conteos | `GET /api/demo/shipments` con `status`, `carrier` y `search` | No hay mapas, gráficas ni edición |
| `/demo/notifications` | `multichannel-notifications` | Reglas de estado sobre un registro | `GET /api/demo/notifications` y `POST /api/demo/notifications/{id}/simulate` | No hay Job, cola, correo ni WhatsApp. Simulate solo marca `sent` y `sent_at` |
| `/demo/tracking` | `white-label-tracking` | Una vista y configuración visual | Selector de marca y de estado en el cliente | No hay API de rastreo. La guía `ABC123456` es fija |
| `/demo/support` | `customer-support-desk` | Lista, hilo y estado | `GET /api/demo/conversations`, el detalle y `PATCH` del `status` | No hay tiempo real, notas ni varios agentes |
| `/demo/legacy` | `legacy-modernization` | La misma información en dos presentaciones | Filtros locales y el cambio Legacy / Modern | No hay backend. La vista anterior es una comparación, no una página Blade real |

## Decisiones

Los endpoints demo viven en `/api/demo/*` y no cambian la API pública de proyectos. El envío simulado es síncrono: un Job no aportaba nada sin un worker. Tracking y la comparación legacy no llaman al backend porque su punto es la interfaz.

Los conteos de logística salen del resultado filtrado. Una ruta de Storage o un estado desconocido no se inventan en la UI: el estado se lee y se etiqueta en texto, no solo con color.
