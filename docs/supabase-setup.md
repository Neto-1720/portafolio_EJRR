# Supabase

Hoy no hay proyecto ni credenciales. El portafolio local usa SQLite y el disco `public`. No inventes URL, claves, bucket ni contraseña de base de datos. Ninguna clave de servidor va en `VITE_*`.

Cuando exista el proyecto, el código de imágenes no cambia: solo `PORTFOLIO_MEDIA_DISK=supabase` y las variables de abajo.

## 1. Crear el proyecto

En [supabase.com](https://supabase.com) crea un proyecto. Anota la región. El nombre del bucket recomendado es `portfolio`.

## 2. Credenciales PostgreSQL

En Project Settings → Database copia host, puerto, base, usuario y contraseña. Van solo en `api/.env`:

```
DB_CONNECTION=pgsql
DB_HOST=
DB_PORT=5432
DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=
DB_SSLMODE=require
```

## 3. Configurar Laravel

`api/.env.example` ya deja PostgreSQL como conexión prevista. El `.env` local puede seguir en SQLite hasta que estas variables estén completas. No subas `.env`.

## 4. Crear el bucket de Storage

Storage → New bucket. Nombre: `portfolio`. Público si las imágenes del portafolio deben verse sin firmar. El backend es el único que sube archivos.

## 5. Nombre del bucket

`portfolio`.

## 6. SUPABASE_URL

Project Settings → API → Project URL. Ejemplo de forma, sin valor real: `https://<ref>.supabase.co`.

## 7. Credenciales de servidor

Para el disco S3 de Storage hacen falta la URL del proyecto, el endpoint S3 y una clave que pueda escribir en el bucket. La service role key, si se usa, vive solo en el backend.

En Storage → S3 Connection, o en la documentación vigente de Supabase, copia endpoint, región, access key y secret. No uses la anon key para subir desde Laravel y no la pongas en el frontend.

El adaptador S3 no está instalado todavía. Cuando vayas a usar el disco:

```bash
cd api
composer require league/flysystem-aws-s3-v3
```

## 8. Variables en `.env`

```
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_STORAGE_BUCKET=portfolio
SUPABASE_STORAGE_KEY=
SUPABASE_STORAGE_SECRET=
SUPABASE_STORAGE_REGION=us-east-1
SUPABASE_STORAGE_ENDPOINT=
SUPABASE_STORAGE_URL=
PORTFOLIO_MEDIA_DISK=supabase
SANCTUM_STATEFUL_DOMAINS=localhost,localhost:5173,127.0.0.1,127.0.0.1:5173
```

`SUPABASE_STORAGE_URL` es la base pública de los objetos, para que `url` de cada imagen apunte al bucket. `SUPABASE_STORAGE_ENDPOINT` es el endpoint S3. Son valores distintos.

`SUPABASE_ANON_KEY` puede quedar vacía. Esta aplicación no llama a Supabase desde React.

## 9. Migraciones

Con la base de PostgreSQL ya configurada:

```bash
cd api
php artisan migrate
php artisan db:seed
php artisan portfolio:create-admin
```

El seeder no crea al administrador.

## 10. Probar un upload

Entra a `/admin/login`, abre un proyecto y sube un jpeg, png o webp de menos de 5 MB. La respuesta debe traer `url` con el origen del bucket. La home y el case study usan esa `url`. Si el archivo no está, `url` queda en `null` y se ve el placeholder.
