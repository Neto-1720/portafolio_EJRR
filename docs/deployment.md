# Deployment

## Base de datos: PostgreSQL en Supabase

Desarrollo y producción usan PostgreSQL de Supabase. Los tests siguen en SQLite en memoria (`api/phpunit.xml`), así que `php artisan test` nunca toca Supabase.

### Variables

Van solo en `api/.env` (local) o en las variables del servidor. No se suben al repo.

```
DB_CONNECTION=pgsql
DB_HOST=aws-0-<region>.pooler.supabase.com
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres.<project-ref>
DB_PASSWORD=
DB_SSLMODE=require
```

Los valores salen de Supabase → Connect → **Session pooler**:

- La conexión directa (`db.<project-ref>.supabase.co`) suele ser solo IPv6. El session pooler funciona por IPv4.
- El transaction pooler (puerto 6543) no conserva sesión ni prepared statements; no usarlo para migraciones.
- `DB_SSLMODE=require` cifra la conexión. `config/database.php` ya lee todas estas variables en la conexión `pgsql`.

Antes de cambiar, el `.env` local apuntaba a SQLite (`api/database/database.sqlite`). Ese archivo no se borra; queda como respaldo local.

### Primera conexión

```bash
cd api
php artisan config:clear
php artisan migrate:status   # confirma la conexión
php artisan migrate          # en producción: php artisan migrate --force
php artisan db:seed          # en producción: php artisan db:seed --force
php artisan portfolio:create-admin
```

Nunca usar `migrate:fresh`, `migrate:refresh`, `migrate:reset` ni `db:wipe` contra Supabase: borran tablas y contenido.

### Seed seguro

Los seeders solo crean lo que falta y nunca actualizan registros existentes:

- Tecnologías: por `slug`.
- Proyectos: por `slug`. Si el proyecto ya existe no se tocan sus campos, tecnologías ni imágenes.
- Certificaciones: por `name`.
- Datos de demos: cada tabla solo se llena si está vacía.

Volver a correr `db:seed` no duplica datos ni sobrescribe lo editado desde `/admin`. Si un proyecto sembrado se borra desde `/admin`, un nuevo `db:seed` lo vuelve a crear.

Estado de publicación sembrado:

| Proyecto | Publicado |
| --- | --- |
| Customer Support Desk | Sí |
| Multichannel Notification System | Sí |
| Settings SPA Modernization | Sí |
| White-Label Tracking Portal | Sí |
| SaaS Logistics Platform | No |
| Legacy Platform Modernization | No |

### Compatibilidad con PostgreSQL

- Las migraciones usan tipos portables (`string`, `text`, `boolean`, `json`, `foreignId`, `timestamps`) y `->change()` nativo de Laravel.
- Las búsquedas de las demos usan `whereLike`, que en PostgreSQL se traduce a `ilike`. Así la búsqueda sigue sin distinguir mayúsculas, igual que en SQLite.

### Verificación

```bash
php artisan test
./vendor/bin/pint --test
curl -s http://127.0.0.1:8000/api/health
curl -s http://127.0.0.1:8000/api/projects
curl -s http://127.0.0.1:8000/api/certifications
```

`/api/projects` debe devolver solo los cuatro proyectos publicados.
