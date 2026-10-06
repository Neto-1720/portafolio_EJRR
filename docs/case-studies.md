# Case studies

`/work/:slug` usa una sola página. Los cinco proyectos comparten la misma estructura y leen `GET /api/projects/{slug}`.

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
  ImagePlaceholder.tsx
```

## Imágenes

Solo se pide una imagen si `path` es `http://`, `https://` o empieza por `/`. Una ruta de Storage se sustituye por el placeholder. La galería pone la primera imagen grande y el resto en una retícula de dos columnas. No hay carrusel ni lightbox.

## Anonimización

Los textos públicos no llevan clientes, teléfonos, correos, guías, direcciones, precios, tokens, llaves, URLs privadas ni nombres internos de producto. Las capturas reales entran después, ya anonimizadas.
