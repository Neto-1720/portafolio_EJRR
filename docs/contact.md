# Contacto

El formulario público guarda el mensaje y después encola un correo. Si el correo falla, el mensaje sigue en la base.

## Flujo

1. `/contact` envía `POST /api/contact`.
2. Laravel valida. Si falla, responde 422 y no guarda nada.
3. Guarda `contact_messages` con estado `new`. La IP y el user agent los pone el servidor. El cliente no puede enviar `status`, `ip_address` ni `user_agent`.
4. Despacha el job `SendContactNotification`.
5. Responde 201: `{ "message": "Mensaje recibido correctamente." }`. No devuelve el id, la IP ni el user agent.
6. El worker envía el correo a `PORTFOLIO_CONTACT_EMAIL`.

## Endpoint

`POST /api/contact` es público.

| Campo | Regla |
|---|---|
| `name` | Obligatorio, texto, máximo 120, sin HTML |
| `email` | Obligatorio, correo, máximo 180 |
| `subject` | Opcional, texto, máximo 160, sin HTML |
| `message` | Obligatorio, texto, entre 10 y 5000 caracteres, sin HTML |

El formulario del navegador solo exige nombre, correo con forma válida y mensaje. Laravel sigue siendo quien decide.

## Límite

5 envíos por minuto por IP. El sexto responde 429. La interfaz dice que hay que esperar un momento.

## Honeypot

El formulario incluye un campo `website` fuera de la pantalla. Una persona no lo llena. Si llega con texto, la API responde 201 y no guarda ni encola nada. No hay CAPTCHA ni servicios externos.

## Cola

`QUEUE_CONNECTION=database`. Los jobs viven en la tabla `jobs`. No hace falta Redis.

En otra terminal, mientras desarrollas:

```bash
cd api
php artisan queue:work
```

No hay un daemon instalado. Si el worker no está corriendo, el mensaje ya está guardado y el job espera en la tabla.

El job reintenta 3 veces. No borra el mensaje si el correo falla.

Con `QUEUE_CONNECTION=sync` el correo se intenta dentro de la misma petición. Si falla, el cliente vería un error aunque la fila ya exista. Por eso el entorno local usa `database`.

## Correo

`MAIL_MAILER=log` escribe el mensaje en `storage/logs/laravel.log`. No hace falta un proveedor para probar el flujo.

`PORTFOLIO_CONTACT_EMAIL` es el destinatario. Si está vacío, el job falla con un error claro y no inventa una dirección. El mensaje de contacto permanece.

El correo lleva nombre, correo, asunto, mensaje y fecha. El reply-to es la persona que escribió.

Para un proveedor real, cambia `MAIL_MAILER` y completa `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD` y `MAIL_FROM_ADDRESS` en `api/.env`. Esas claves no van al frontend.

## Admin

`/admin/messages` lista nombre, correo, asunto, estado y fecha. Al abrir uno se ve el texto completo, como texto, sin HTML.

Estados: `new`, `read`, `archived`. Desde el panel se puede marcar leído o archivar. No se responde desde el portafolio y no hay borrado.

`GET /api/admin/messages`, `GET /api/admin/messages/{message}` y `PATCH /api/admin/messages/{message}` requieren sesión.
