# Case studies

`/work/:slug` usa una sola página. Los proyectos publicados comparten la misma estructura y leen `GET /api/projects/{slug}`. SaaS Logistics Platform y Legacy Platform Modernization siguen guardados, sin publicar, hasta que tengan capturas.

## Secciones

Hero, Overview, Problem, My Role, Solution, Technical Decisions, Challenges, Results, Learnings, Gallery, Interactive Demo si el proyecto tiene una, y el regreso a Work. Una sección de texto no se muestra si el campo viene vacío. No se parten los párrafos en listas que la API no envía.

El hero y la sección Technologies muestran las mismas insignias. El overview resume el stack en una línea. Las secciones de texto no vuelven a listarlas. Role, period y context solo aparecen si tienen valor.

## Componentes

```
web/src/features/work/
  CaseStudyHero.tsx
  CaseStudySection.tsx
  CaseStudySkeleton.tsx
  ProjectOverview.tsx
  ProjectGallery.tsx
  ProjectGalleryCarousel.tsx
  ImagePlaceholder.tsx
```

## Imágenes

La portada del hero y de la tarjeta usa el screenshot marcado como `is_cover` solo si `url` o `path` es `http://`, `https://` o empieza por `/`. Si el archivo no existe, o la imagen falla al cargar, se mantiene `ProjectCover`.

La Gallery muestra `ProjectGalleryCarousel` cuando hay una o más capturas con URL usable. Si no hay ninguna, se queda el placeholder premium con el título del proyecto. Cada captura se ve completa, centrada en un marco ancho. Con varias imágenes el carrusel avanza solo, en bucle, y se pausa al pasar el cursor, al enfocar o si el sistema pide menos movimiento. También hay anterior, siguiente, pausa, indicadores, caption y alt. Las flechas del teclado mueven la imagen cuando el carrusel tiene foco. En táctil, un desplazamiento horizontal cambia de imagen.

Settings SPA Modernization no tiene mini demo propia. El caso enlaza la demo de Legacy Platform Modernization, que ya muestra un corte parecido.

## Dónde dejar las capturas

```
web/public/projects/
  logistics/
  notifications/
  tracking/
  support/
  legacy/
  settings-spa/
```

Nombres previstos: `cover.webp`, `01-overview.webp`, `02-detail.webp`, `03-mobile.webp`. Settings SPA ya tiene sus capturas en `web/public/projects/settings-spa/`. Conviene exportarlas en WebP, con el lado largo cerca de 1600 px, antes de subirlas. La aplicación no las comprime en runtime.

El admin sigue subiendo jpeg, png o webp a `project_images` (alt, caption, portada y orden). Una ruta pública como `/projects/logistics/01-overview.webp` también vale si queda guardada en `path`: el carrusel la usa sin pasar por Storage.

## Anonimización

Los textos públicos no llevan clientes, teléfonos, correos, guías, direcciones, precios, tokens, llaves, URLs privadas ni nombres internos de producto. Las capturas reales entran después, ya anonimizadas.

Antes de registrar una captura:

- recortar o tapar clientes, teléfonos, correos y direcciones;
- quitar guías, IDs, precios y datos contractuales;
- quitar tokens, llaves y URLs privadas;
- no depender de OCR ni de interpretación automática del contenido.
