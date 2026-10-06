<?php

return [

    /*
    | Disco de imágenes públicas del portafolio.
    | public: filesystem local (storage/app/public) mientras no haya Supabase.
    | supabase: disco S3 compatible. Las claves viven solo en el .env del API.
    */
    'media_disk' => env('PORTFOLIO_MEDIA_DISK', 'public'),

];
