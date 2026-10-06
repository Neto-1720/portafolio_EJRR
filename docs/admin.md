# Administrador

Un solo administrador. No hay registro público ni roles.

## Autenticación

React habla con Laravel Sanctum en modo SPA: la sesión vive en una cookie httpOnly. El navegador no guarda un token ni la contraseña.

En local el frontend está en `localhost:5173` y la API en `127.0.0.1:8000`. Esos hosts son sitios distintos, así que una cookie `SameSite=Lax` no viajaría en las peticiones. Vite hace de proxy de `/api` y `/sanctum` hacia `http://127.0.0.1:8000`. En `npm run dev` las llamadas salen del mismo origen y la cookie se envía.

En un build de producción el navegador usa `VITE_API_URL`, `credentials: 'include'` y CORS con `supports_credentials`. `SANCTUM_STATEFUL_DOMAINS` tiene que incluir el origen del frontend. `SESSION_DOMAIN` se deja en `null` mientras API y frontend no compartan un dominio padre. No pongas `SESSION_DOMAIN=localhost` si la API responde en `127.0.0.1`.

Antes de un POST, el cliente pide `GET /sanctum/csrf-cookie` y reenvía la cookie `XSRF-TOKEN` como header `X-XSRF-TOKEN`. No se usa `localStorage`.

No hay tabla de tokens personales. Sanctum aquí solo autentica la sesión.

## Crear el administrador

```bash
cd api
php artisan portfolio:create-admin
```

Pide nombre, correo y contraseña. La contraseña se hashea con el cast del modelo `User`. El comando no la imprime. No está en el seeder.

## Rutas del frontend

| Ruta | Acceso |
|---|---|
| `/admin/login` | Pública |
| `/admin` | Sesión |
| `/admin/projects` | Sesión |
| `/admin/projects/new` | Sesión |
| `/admin/projects/:id` | Sesión |
| `/admin/certifications` | Sesión |
| `/admin/messages` | Sesión |

Sin sesión, el resto redirige a `/admin/login`.

## API

Públicas de sesión:

| Método | Ruta |
|---|---|
| POST | `/api/login` |
| POST | `/api/logout` |
| GET | `/api/user` |

Protegidas con `auth:sanctum`, prefijo `/api/admin`:

- `GET /dashboard`
- proyectos: listar, ver, crear, actualizar, eliminar
- imágenes de un proyecto: subir, actualizar, eliminar
- certificaciones: listar, crear, actualizar, eliminar
- `GET /messages`

`POST /api/login` admite 5 intentos por minuto. Eliminar un proyecto pide confirmación en la pantalla. Lo habitual es despublicar.

Las policies `ProjectPolicy` y `CertificationPolicy` exigen un usuario autenticado. No hay roles: el middleware ya rechaza al invitado y la policy marca el punto de autorización.

Los errores de validación responden 422 con `errors`. El formulario muestra el mensaje junto al campo.

## Imágenes en local

`PORTFOLIO_MEDIA_DISK=public`. Los archivos quedan en `storage/app/public` y se publican con:

```bash
php artisan storage:link
```

El negocio usa `PortfolioStorage` y `ProjectImageService`. No sabe si el disco es local o Supabase. La API añade `url` junto a `path`. Si el archivo no existe, `url` es `null` y el sitio público conserva el placeholder.

Tipos: jpeg, png y webp. Máximo 5 MB. Se valida el MIME. Solo una imagen por proyecto puede ser portada; al marcar otra, las demás se desmarcan en la misma transacción.

Cómo pasar el disco a Supabase está en [supabase-setup.md](supabase-setup.md).
