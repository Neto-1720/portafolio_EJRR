# Ernesto Rodríguez — Portfolio

Portafolio de Ernesto Jahir Rodríguez Ramírez, Full Stack Developer. Una SPA en React que consume una API REST en Laravel, con base de datos y almacenamiento de imágenes en Supabase.

**Live Portfolio:** [portafolio-ejrr.vercel.app](https://portafolio-ejrr.vercel.app)

## Stack

- **Backend:** Laravel 13, PHP 8.4+, REST API, Sanctum
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS
- **Datos:** PostgreSQL (Supabase), Supabase Storage

## Arquitectura

```
portfolio/
  web/    React + TypeScript + Vite
  api/    Laravel REST API
  docs/   Documentación
```

React consume la API REST en Laravel para los datos de la aplicación. Laravel gestiona el acceso a PostgreSQL y la integración con Supabase Storage.
## Funcionalidades

- Portafolio público: Home, Work y About.
- Case studies de proyectos con galería de capturas.
- Mini demos interactivas con datos ficticios.
- Panel de administración con Sanctum: proyectos, imágenes y certificaciones.
- Imágenes servidas desde Supabase Storage.
- API pública de solo lectura: proyectos, tecnologías y certificaciones.
- Modo oscuro y diseño responsive.

## Deployment

| Capa | Servicio |
| --- | --- |
| Frontend | Vercel |
| Backend | Railway (temporal) |
| Base de datos | Supabase PostgreSQL |
| Storage | Supabase Storage |

## Desarrollo local

Requisitos: PHP 8.4+ con `pdo_pgsql`, Composer 2, Node.js 24 y npm.

API:

```bash
cd api
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

Configura la conexión a la base en `api/.env` antes de migrar. Para crear el usuario del admin: `php artisan portfolio:create-admin`.

Frontend:

```bash
cd web
npm install
cp .env.example .env
npm run dev
```

En desarrollo, Vite redirige `/api` y `/sanctum` a la API local.

Pruebas: `php artisan test` en `api/` y `npm run test` en `web/`.

Más detalle en [docs/](docs/): [arquitectura](docs/arquitectura.md), [deployment](docs/deployment.md), [admin](docs/admin.md), [case studies](docs/case-studies.md) y [demos](docs/demos.md).

## Autor

**Ernesto Jahir Rodríguez Ramírez**\
Full Stack Developer\
[portafolio-ejrr.vercel.app](https://portafolio-ejrr.vercel.app)
