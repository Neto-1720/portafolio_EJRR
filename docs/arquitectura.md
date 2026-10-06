# Arquitectura

El navegador habla solo con la API de Laravel. Laravel es el único cliente de PostgreSQL y, más adelante, de Supabase Storage.

```
React (web/)
    ↓  REST
Laravel (api/)
    ↓
PostgreSQL en Supabase
```

`GET /api/health` comprueba que esa cadena HTTP responde. No consulta la base de datos.

La configuración de Postgres y de Supabase vive en variables de entorno (`api/.env.example`). No hay claves en el repositorio. El frontend no recibe `SUPABASE_SERVICE_ROLE_KEY` ni usa Supabase para leer o escribir datos.

CORS acepta únicamente `FRONTEND_URL`.

Docker no está incluido. Se añadirá cuando haga falta para el entorno local o el despliegue.

## Persistencia

Las migraciones del portafolio viven en `api/database/migrations`. Los modelos Eloquent están en `api/app/Models`.

```
projects  >──<  technologies
    │              (project_technology)
    └──< project_images

demo_conversations ──< demo_messages
```

También existen `certifications`, `contact_messages`, `demo_shipments` y `demo_notifications`. No tienen relación con otras tablas del portafolio.

Para crear el esquema y los datos ficticios:

```bash
cd api
php artisan migrate:fresh --seed
```

Con Supabase, `DB_CONNECTION` es `pgsql` y `DB_SSLMODE` es `require`. Sin credenciales, el mismo comando corre sobre SQLite si `DB_CONNECTION=sqlite`. Las pruebas de PHPUnit no usan ninguna de las dos: migran SQLite en memoria.

`certifications.issuer` es nullable. Si el emisor no se conoce, se guarda `null`.

## API pública

React todavía no llama a estos endpoints. La lectura pública es:

- `GET /api/health`
- `GET /api/projects`
- `GET /api/projects?featured=1`
- `GET /api/projects/{slug}`
- `GET /api/technologies`
- `GET /api/certifications`

El listado y el detalle de proyectos cargan tecnologías e imágenes en la misma petición, no una consulta por registro. Un proyecto no publicado responde 404. Los ejemplos de JSON están en el README, sección Public API.
