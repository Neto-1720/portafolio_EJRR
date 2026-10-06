<?php

namespace Database\Seeders;

use App\Models\Certification;
use Illuminate\Database\Seeder;

class CertificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * El emisor, la fecha y la URL no están en el material del proyecto.
     */
    public function run(): void
    {
        $certifications = [
            'React para principiantes',
            'Usa Laravel para consumir APIs y Servicios HTTP',
        ];

        foreach ($certifications as $index => $name) {
            Certification::query()->create([
                'name' => $name,
                'issuer' => null,
                'issued_at' => null,
                'credential_url' => null,
                'image_path' => null,
                'sort_order' => $index + 1,
                'is_published' => true,
            ]);
        }
    }
}
