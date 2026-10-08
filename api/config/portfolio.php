<?php

return [

    /*
    | Disco de imágenes públicas del portafolio.
    | public: filesystem local (storage/app/public) mientras no haya Supabase.
    | supabase: disco S3 compatible. Las claves viven solo en el .env del API.
    */
    'media_disk' => env('PORTFOLIO_MEDIA_DISK', 'public'),

    /*
    | Carpeta pública del frontend. Las imágenes sembradas con path
    | "/projects/..." viven aquí hasta migrarlas al disco de medios.
    */
    'local_media_root' => env('PORTFOLIO_LOCAL_MEDIA_ROOT', base_path('../web/public')),

    /*
    | Correo que recibe los avisos del formulario público.
    | Vacío hasta que se defina. El job no inventa un destinatario.
    */
    'contact_email' => env('PORTFOLIO_CONTACT_EMAIL'),

];
