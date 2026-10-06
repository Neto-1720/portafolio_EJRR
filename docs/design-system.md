# Sistema visual

La interfaz es clara y cálida. El fondo es crema, las piezas son blanco cálido y el naranja solo marca foco, selección puntual y la línea de experiencia. No es un tema oscuro.

Los tokens viven en `web/src/index.css`, dentro de `@theme`. Tailwind es la capa de estilos. No hay una hoja por componente.

## Color

| Token | Valor | Uso |
|---|---|---|
| background | `#f7f0e7` | Página |
| surface | `#fffdfb` | Cards, navbar activa, botones secundarios |
| surface-secondary | `#f3ebe3` | Imagen vacía, badges, skeletons |
| border | `#e5d9c9` | Bordes suaves |
| text-primary | `#1c1917` | Títulos y botón primario |
| text-secondary | `#57534e` | Párrafos |
| text-muted | `#6b635c` | Fechas, etiquetas, metadatos |
| accent | `#a85410` | Foco y marcas pequeñas |
| accent-soft | `#f6e8d8` | Hover tenue |
| success | `#3d6b4f` | Estado positivo |
| warning | `#8a5a12` | Aviso |
| danger | `#9a4038` | Error |

El botón primario es carbón con texto crema. El naranja no rellena bloques grandes.

## Forma, sombra y tipo

Radios: `sm` 8px, `md` 12px, `lg` 20px, `xl` 28px. Las cards usan `xl`, los botones `md` y los badges son píldora.

Sombras: `sm` para el reposo, `md` para la card en hover, `lg` reservada. Son carbón al 3–7% de opacidad, sin glow.

Tipografía: Geist Variable y Geist Mono Variable. Fallback sans: `system-ui`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`. Escala: display 2.25rem, h1 1.875rem, h2 1.375rem, h3 1.0625rem, body 1rem, small 0.875rem, caption y mono-label 0.75rem.

El espaciado usa la base de 4px de Tailwind. La página trabaja con 8, 12, 16, 24, 32, 40, 56 y 80.

## Componentes

```
web/src/components/
  ui/          primitivas
  layout/      navbar, main y footer
  content/     proyecto, tecnología, certificación y experiencia
  feedback/    carga, error, vacío y skeleton
```

Un botón ejecuta una acción. Un enlace navega. GitHub, LinkedIn y el correo salen de `VITE_GITHUB_URL`, `VITE_LINKEDIN_URL` y `VITE_EMAIL`. Si faltan, el texto se muestra y no se inventa una URL. Engineering no es una ruta: el navbar apunta a `/#engineering`.
