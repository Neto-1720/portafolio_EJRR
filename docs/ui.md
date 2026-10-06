# Interfaz

La base visual vive en `web/`. Tailwind es la capa de estilos. `web/src/index.css` concentra el reset corto y los tokens en `@theme`. No hay una hoja CSS por componente.

## Tokens

Colores: `background`, `surface`, `surface-elevated`, `border`, `text-primary`, `text-secondary`, `text-muted`, `accent`, `accent-hover`, `success`, `warning`, `danger`.

Tipografía: `display`, `h1`, `h2`, `h3`, `body`, `small`, `caption`, `mono-label`. La sans es Geist Variable y la mono es Geist Mono Variable, con fallbacks del sistema. El acento ámbar se usa en botones y en el anillo de foco, no como color de párrafos.

## Carpetas

```
web/src/components/
  ui/          primitivas reutilizables
  layout/      navbar, main y footer
  content/     tarjetas de proyecto, tecnología, certificación y experiencia
  feedback/    carga, error, vacío y skeleton
```

`config/site.ts` guarda el nombre, el rol y los enlaces externos. GitHub, LinkedIn y el correo salen de `VITE_GITHUB_URL`, `VITE_LINKEDIN_URL` y `VITE_EMAIL`. Si faltan, el texto se muestra y no se inventa una URL. El CV apunta a `/cv.pdf`.

Engineering no es una ruta. El enlace del navbar va a `/#engineering`.
