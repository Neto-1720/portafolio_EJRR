# Sistema visual del portafolio

El lenguaje sigue siendo crema, blanco cálido, carbón y naranja como acento. El modo oscuro usa los mismos tokens. Esta nota cubre la identidad y las covers, no el producto.

## Marca

El monograma vive en `web/src/assets/branding/Monogram.tsx`. Son las letras E y R en un cuadrado redondeado, con un punto naranja. Se usa en la navegación, el pie, el admin y el login.

`web/public/favicon.svg` es la versión reducida: fondo carbón, trazos crema y el mismo punto. No depende del tema del sitio.

No es una marca corporativa. No hay variantes, logotipo horizontal ni manual aparte.

## Iconos

La iconografía es [Lucide](https://lucide.dev/) (`lucide-react`). Entra en navegación, secciones, tarjetas, KPIs de las demos y placeholders. Los iconos decorativos van con `aria-hidden`.

## Covers

Cada proyecto publicado tiene una cover abstracta en `web/src/assets/covers/ProjectCover.tsx`. No son fotos ni imágenes de stock. Usan iconos, bloques de interfaz y los tokens del tema, así que cambian con el modo oscuro.

La cover aparece en la tarjeta y en el hero del case study cuando no hay un archivo real. Si la API devuelve una `url` usable, esa imagen reemplaza la cover. La galería sin archivo usa `ImagePlaceholder`.

Las cinco covers son logística, avisos, rastreo, soporte y modernización. Comparten el mismo marco (punto, etiqueta, superficie) y cambian la composición.

## Hero

`web/src/assets/illustrations/ProductPanels.tsx` es la composición de la home: un panel de producto, tags técnicas y un bloque de API. No usa terminal ni código decorativo.

## Assets

```
web/src/assets/
  branding/        monograma
  covers/          covers de proyecto
  illustrations/   composición del hero
```

No hay una carpeta de iconos propia: Lucide se importa por nombre y el build solo incluye los que se usan.
