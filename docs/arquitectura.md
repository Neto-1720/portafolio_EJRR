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
