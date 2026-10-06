# api

API Laravel del portafolio. Los comandos y las variables están en el [README de la raíz](../README.md).

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan serve
```

`GET /api/health` responde `{"status":"ok"}`.
