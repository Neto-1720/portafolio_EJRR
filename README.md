# Portfolio — Ernesto Jahir Rodríguez Ramírez

Base técnica de un portafolio full stack. Esta fase deja el monorepo instalable, con el frontend hablando con la API. Todavía no hay pantallas finales, case studies, admin ni el esquema de datos del portafolio.

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

El detalle está en [docs/arquitectura.md](docs/arquitectura.md).

## Estructura

```
portfolio/
  web/          SPA
  api/          API Laravel
  docs/         Notas de arquitectura
  README.md
  .gitignore
```

Frontend:

```
web/src/
  app/          router
  components/   layout
  features/     comprobación de /api/health
  pages/        placeholders
  services/     cliente HTTP
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

Cuando `DB_*` apunte a Supabase:

```bash
php artisan migrate
```

El esqueleto de Laravel trae migraciones de `users`, `cache` y `jobs`. El esquema del portafolio todavía no existe.

Sin credenciales de Supabase, el `.env` local puede usar SQLite para migrar esas tablas del esqueleto:

```bash
touch database/database.sqlite
```

y en `.env`:

```
DB_CONNECTION=sqlite
```

Eso no sustituye a Postgres. Solo permite trabajar en local antes de tener el proyecto de Supabase.

## Variables de entorno

`web/.env.example`

| Variable | Uso |
| --- | --- |
| `VITE_API_URL` | Origen de la API, sin barra final. En local: `http://127.0.0.1:8000` |

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

## Testing

```bash
cd api
php artisan test
```

Hay una prueba de `GET /api/health`, incluido el encabezado CORS.

En el frontend:

```bash
cd web
npm run lint
npx tsc -b --pretty false
npm run build
```

Pest, Vitest y Playwright no están instalados. Entran en una fase posterior.

## Qué no está en esta base

Pantallas finales, case studies, demos, admin, autenticación, CRUDs, el esquema del portafolio, Storage y despliegue.
