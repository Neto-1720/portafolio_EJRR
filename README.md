# Portfolio — Ernesto Jahir Rodríguez Ramírez

Base técnica de un portafolio full stack. El monorepo ya tiene el esquema de datos, la API pública de lectura y la home conectada a esa API. Todavía no hay case studies completos ni admin.

## Arquitectura

- React + TypeScript
- Laravel + PHP
- PostgreSQL / Supabase

```
React (web/)
    ↓  REST
Laravel (api/)
    ↓
PostgreSQL en Supabase
```

El detalle está en [docs/arquitectura.md](docs/arquitectura.md). El sistema visual está en [docs/design-system.md](docs/design-system.md).

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
  features/     home y comprobación de /api/health
  pages/        home, work, about y contact
  services/     cliente HTTP de la API pública
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
| `SUPABASE_STORAGE_BUCKET` | Bucket reservado para uploads futuros |

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

La home temporal llama a `GET /api/health`. Si la API responde, se muestra «Backend conectado». Si no, se muestra el error.

## Modelo de datos

Laravel es el único cliente de la base. React no consulta estas tablas.

| Tabla | Relación |
| --- | --- |
| `projects` | Pertenece a muchas `technologies`. Tiene muchas `project_images`. |
| `technologies` | Pertenece a muchos `projects` por `project_technology`. |
| `project_images` | Pertenece a un `project`. `path` reserva el archivo; Storage todavía no sube nada. |
| `certifications` | Catálogo independiente. |
| `contact_messages` | Bandeja futura. Sin formulario ni correo. |
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

## Testing

```bash
cd api
php artisan test
```

PHPUnit cubre `GET /api/health`, el esquema, el seeder y la API pública. Las pruebas usan SQLite en memoria.

En el frontend:

```bash
cd web
npm run lint
npx tsc -b --pretty false
npm run build
```

Pest, Vitest y Playwright no están instalados. Entran en una fase posterior.

## Home y API

En desarrollo, React llama a Laravel por el proxy de Vite (`/api` y `/sanctum` hacia `127.0.0.1:8000`), así la sesión de Sanctum comparte origen. El build de producción usa `VITE_API_URL` y envía cookies. Los componentes no hacen `fetch`: usan `web/src/services/`. El admin está en `/admin` y se explica en [docs/admin.md](docs/admin.md).

La home pide `GET /api/projects?featured=1`, `GET /api/technologies` y `GET /api/certifications`. `/work` pide `GET /api/projects`. El detalle pide `GET /api/projects/{slug}` y arma el case study. La estructura está en [docs/case-studies.md](docs/case-studies.md). Las mini demos viven en `/demo/*` y se explican en [docs/demos.md](docs/demos.md).

El perfil público vive en `web/src/config/profile.ts`. Nombre y rol están en código. GitHub, LinkedIn, correo y CV salen de variables de entorno y, si faltan, no se inventan.

Cada imagen pública incluye `path` y `url`. `url` es usable por el navegador cuando el archivo existe en el disco configurado. Si no hay archivo, `url` es `null` y la galería sigue mostrando el placeholder. El frontend no arma URLs de Storage.

El administrador, la sesión y las imágenes se documentan en [docs/admin.md](docs/admin.md) y [docs/supabase-setup.md](docs/supabase-setup.md).

## Qué no está en esta base

El formulario de contacto, colas, correo real, WhatsApp real y despliegue. Supabase todavía no tiene credenciales: las imágenes locales usan el disco `public`.
