# Portfolio — Ernesto Jahir Rodríguez Ramírez

Portafolio público de un Full Stack Developer. Presenta proyectos, case studies, mini demos técnicas y un formulario de contacto. Un administrador privado edita el contenido.

Todavía no está desplegado. No hay dominio ni capturas del sitio en el repositorio.

## Capturas

Pendientes. Cuando existan, irán aquí. No se usan imágenes de trabajo real hasta tener autorización para publicarlas.

## Arquitectura

- React + TypeScript
- Laravel + PHP
- PostgreSQL / Supabase

```
React (web/)
    ↓  REST
Laravel (api/)
    ↓
PostgreSQL
    ↓
Storage

Queue (database) → Mail
```

El detalle está en [docs/arquitectura.md](docs/arquitectura.md). El sistema visual está en [docs/design-system.md](docs/design-system.md). El monograma y las covers están en [docs/visual-system.md](docs/visual-system.md).

## Estructura

```
portfolio/
  web/          SPA
  api/          API Laravel
  docs/         Arquitectura e interfaz
  README.md
  .gitignore
```

Frontend:

```
web/src/
  app/          router
  components/   ui, layout, content, feedback
  config/       perfil y navegación
  features/     home, work, demos y admin
  pages/        públicas, case studies, demos y admin
  services/     cliente HTTP de la API
  seo/          título, meta y sitemap
  hooks/
  types/
  utils/
```

## Requisitos

- Node.js 24
- npm 11
- PHP 8.3 o superior (el entorno de desarrollo usa 8.4)
- Composer 2
- Extensión PHP `pdo_pgsql`

PostgreSQL lo aporta Supabase. Hace falta un proyecto de Supabase propio para migrar contra esa base. Sin esas credenciales, la API igual arranca y `GET /api/health` responde.

Docker se añadirá después. No hace falta para arrancar.

## Instalación del frontend

```bash
cd web
npm install
cp .env.example .env
```

## Instalación del backend

```bash
cd api
composer install
cp .env.example .env
php artisan key:generate
```

Con Postgres de Supabase en `.env`:

```bash
php artisan migrate:fresh --seed
```

Sin credenciales, el `.env` local puede seguir en SQLite:

```bash
touch database/database.sqlite
```

```
DB_CONNECTION=sqlite
```

```bash
php artisan migrate:fresh --seed
```

SQLite no sustituye a Supabase. Sirve para migrar y sembrar en local. El detalle de las tablas está en [Modelo de datos](#modelo-de-datos).

## Variables de entorno

`web/.env.example`

| Variable | Uso |
| --- | --- |
| `VITE_API_URL` | Origen de la API, sin barra final. En local: `http://127.0.0.1:8000` |
| `VITE_GITHUB_URL` | Opcional. Si falta, el enlace no se muestra. |
| `VITE_LINKEDIN_URL` | Opcional. Si falta, el enlace no se muestra. |
| `VITE_EMAIL` | Opcional. Si falta, el correo no se muestra. |
| `VITE_CV_URL` | Opcional. Si falta, no hay botón de CV. |
| `VITE_SITE_URL` | Origen público, sin barra final. Vacío hasta tener dominio. Activa canonical, `og:url` y el sitemap del build. |

`api/.env.example`

| Variable | Uso |
| --- | --- |
| `APP_KEY` | La genera `php artisan key:generate`. No se versiona. |
| `APP_URL` | URL de la API. |
| `FRONTEND_URL` | Origen permitido por CORS. En local: `http://localhost:5173` |
| `DB_CONNECTION` | `pgsql` |
| `DB_HOST` | Host de Postgres en Supabase |
| `DB_PORT` | `5432` |
| `DB_DATABASE` | Nombre de la base |
| `DB_USERNAME` | Usuario |
| `DB_PASSWORD` | Contraseña |
| `DB_SSLMODE` | `require` para Supabase |
| `SUPABASE_URL` | URL del proyecto |
| `SUPABASE_ANON_KEY` | Clave anónima. No la usa React. |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave de servicio, solo en el servidor |
| `SUPABASE_STORAGE_BUCKET` | Bucket preparado. Vacío de credenciales. |
| `PORTFOLIO_MEDIA_DISK` | `public` en local. `supabase` cuando existan credenciales. |
| `PORTFOLIO_CONTACT_EMAIL` | Destino del aviso de contacto. Vacío hasta configurarlo. |
| `QUEUE_CONNECTION` | `database` para que el formulario no espere al correo. |

No hay claves reales en Git.

## Cómo ejecutar

Terminal del frontend:

```bash
cd web
npm run dev
```

Terminal del backend:

```bash
cd api
php artisan serve
```

El frontend en desarrollo usa el proxy de Vite hacia `http://127.0.0.1:8000`. El admin y el contacto necesitan ese proxy para la cookie de Sanctum.

Para el correo local:

```bash
cd api
php artisan queue:work
```

Sin `PORTFOLIO_CONTACT_EMAIL` el job falla y el mensaje sigue guardado. `MAIL_MAILER=log` escribe el aviso en `storage/logs`, que no se versiona.

## Modelo de datos

Laravel es el único cliente de la base. React no consulta estas tablas.

| Tabla | Relación |
| --- | --- |
| `projects` | Pertenece a muchas `technologies`. Tiene muchas `project_images`. |
| `technologies` | Pertenece a muchos `projects` por `project_technology`. |
| `project_images` | Pertenece a un `project`. El admin sube jpeg, png o webp al disco configurado. |
| `certifications` | Catálogo independiente. |
| `contact_messages` | Mensajes del formulario público. El correo sale por un job. |
| `demo_shipments` | Envíos ficticios. |
| `demo_notifications` | Avisos ficticios. Sin envío real. |
| `demo_conversations` | Tiene muchos `demo_messages`. |
| `demo_messages` | Pertenece a una `demo_conversations`. |

`project_technology` borra el vínculo si se borra el proyecto o la tecnología. Las imágenes se borran con el proyecto. Los mensajes se borran con la conversación.

Categorías de tecnología, estados de envío, canal de aviso y tipo de emisor son texto. No hay un enum de Postgres, para poder sumar valores después.

El seeder crea 5 proyectos, 15 tecnologías, 5 rutas de imagen, 2 certificaciones, 15 envíos, 10 avisos, 5 conversaciones y 20 mensajes. Los tres proyectos destacados son logística, notificaciones y mesa de soporte. Las empresas de los demos son Acme Logistics, Nova Commerce y Northstar Retail.

Para conectar Supabase, completa en `api/.env` los valores del panel (Database → conexión directa, puerto 5432) y ejecuta:

```bash
cd api
php artisan migrate:fresh --seed
```

Variables: `DB_CONNECTION=pgsql`, `DB_HOST`, `DB_PORT=5432`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`, `DB_SSLMODE=require`.

## Public API

Lectura pública, sin autenticación. Las colecciones y el detalle usan el wrapper `data` de Laravel. `GET /api/health` sigue respondiendo `{"status":"ok"}`, sin ese wrapper.

| Método | Ruta | Respuesta |
| --- | --- | --- |
| GET | `/api/health` | Estado de la API |
| GET | `/api/projects` | Proyectos publicados, por `sort_order` e `id` |
| GET | `/api/projects?featured=1` | Solo publicados y destacados |
| GET | `/api/projects/{slug}` | Detalle si está publicado. Si no existe o es borrador, 404 |
| GET | `/api/technologies` | Catálogo ordenado por categoría, `sort_order` y nombre |
| GET | `/api/certifications` | Certificaciones publicadas. `issuer` puede ser `null` |

`featured` solo filtra cuando vale `1`. El listado de proyectos no incluye los textos largos del caso. `cover_image` es la imagen con `is_cover`; si no hay, la primera por `sort_order`; si no hay imágenes, `null`.

Ejemplo de card:

```json
{
  "data": [
    {
      "slug": "saas-logistics-platform",
      "title": "SaaS Logistics Platform",
      "is_featured": true,
      "cover_image": { "path": "projects/saas-logistics-platform/cover.webp", "is_cover": true },
      "technologies": [{ "name": "Laravel", "slug": "laravel", "category": "backend" }]
    }
  ]
}
```

Ejemplo de certificación:

```json
{
  "data": [
    {
      "name": "React para principiantes",
      "issuer": null,
      "issued_at": null,
      "credential_url": null,
      "image_path": null
    }
  ]
}
```

Los GET públicos comparten el límite de Laravel: 60 solicitudes por minuto por IP. CORS sigue aceptando solo `FRONTEND_URL`.

## Features

- Home, Work, About y Contact.
- Case studies publicados.
- Cinco mini demos con datos ficticios: `/demo/logistics`, `/demo/notifications`, `/demo/tracking`, `/demo/support`, `/demo/legacy`.
- Admin en `/admin` con Sanctum: proyectos, certificaciones, imágenes y mensajes.
- Formulario de contacto, cola `database` y job de correo.
- Tema claro y nocturno.

## Testing

Backend:

```bash
cd api
php artisan test
./vendor/bin/pint --test
```

PHPUnit cubre la API pública, el admin, la subida de imágenes, el contacto, el límite de solicitudes, el job de correo, los mensajes y las demos. Usa SQLite en memoria. No se añadieron pruebas duplicadas.

Frontend:

```bash
cd web
npm run lint
npm run test
npm run build
```

Vitest cubre botón, tarjeta de proyecto, badge, tema, validación del contacto y estados de carga, error y vacío.

Playwright, con la API en `127.0.0.1:8000`:

```bash
cd web
npx playwright install chromium
npm run test:e2e
```

El flujo de admin lee `E2E_ADMIN_EMAIL` y `E2E_ADMIN_PASSWORD` del entorno. Si faltan, ese caso se omite. La contraseña no se guarda en el repositorio. El usuario se crea en local con `php artisan portfolio:create-admin`.

## SEO

Cada página pública define título y descripción en el cliente. `index.html` deja los de la home para el primer render. Canonical y `og:url` solo aparecen si `VITE_SITE_URL` está definido. No hay imagen Open Graph inventada: `og:image` se escribe cuando el case study tiene una URL real de imagen.

`web/public/robots.txt` permite el sitio y bloquea `/admin`. No es un control de acceso. El sitemap se genera en `dist/sitemap.xml` durante `npm run build` cuando `VITE_SITE_URL` es `http` o `https`. Incluye `/`, `/work`, `/about`, `/contact` y los cinco case studies publicados. No incluye `/admin` ni `/demo`.

Es una SPA. Un crawler que no ejecuta JavaScript ve el título y la descripción de la home. No hay SSR.

## Home y API

En desarrollo, React llama a Laravel por el proxy de Vite (`/api` y `/sanctum` hacia `127.0.0.1:8000`), así la sesión de Sanctum comparte origen. El build de producción usa `VITE_API_URL` y envía cookies. Los componentes no hacen `fetch`: usan `web/src/services/`. El admin está en `/admin` y se explica en [docs/admin.md](docs/admin.md).

La home pide `GET /api/projects?featured=1`, `GET /api/technologies` y `GET /api/certifications`. `/work` pide `GET /api/projects`. El detalle pide `GET /api/projects/{slug}` y arma el case study. La estructura está en [docs/case-studies.md](docs/case-studies.md). Las mini demos viven en `/demo/*` y se explican en [docs/demos.md](docs/demos.md).

El perfil público vive en `web/src/config/profile.ts`. Nombre y rol están en código. GitHub, LinkedIn, correo y CV salen de variables de entorno y, si faltan, no se inventan.

Cada imagen pública incluye `path` y `url`. `url` es usable por el navegador cuando el archivo existe en el disco configurado. Si no hay archivo, `url` es `null` y la galería sigue mostrando el placeholder. El frontend no arma URLs de Storage.

El administrador, la sesión y las imágenes se documentan en [docs/admin.md](docs/admin.md) y [docs/supabase-setup.md](docs/supabase-setup.md). El formulario de `/contact`, la cola y el correo se explican en [docs/contact.md](docs/contact.md).

## Despliegue

Pendiente. Falta dominio, `VITE_SITE_URL`, `VITE_API_URL` de producción, CORS, cola en el servidor, un proveedor de correo real y, si se usa, las credenciales de Supabase. No hay CI ni analytics.

## Qué no está

WhatsApp real, un proveedor de correo conectado, capturas y despliegue. En local el correo se escribe en el log. Supabase no tiene credenciales: las imágenes locales usan el disco `public`.
