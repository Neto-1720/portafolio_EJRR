<?php

namespace Database\Seeders;

use App\Models\Technology;
use Illuminate\Database\Seeder;

class TechnologySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $technologies = [
            ['name' => 'Laravel', 'slug' => 'laravel', 'category' => Technology::CATEGORY_BACKEND],
            ['name' => 'PHP', 'slug' => 'php', 'category' => Technology::CATEGORY_BACKEND],
            ['name' => 'React', 'slug' => 'react', 'category' => Technology::CATEGORY_FRONTEND],
            ['name' => 'TypeScript', 'slug' => 'typescript', 'category' => Technology::CATEGORY_FRONTEND],
            ['name' => 'Tailwind CSS', 'slug' => 'tailwind-css', 'category' => Technology::CATEGORY_FRONTEND],
            ['name' => 'Vite', 'slug' => 'vite', 'category' => Technology::CATEGORY_TOOLING],
            ['name' => 'PostgreSQL', 'slug' => 'postgresql', 'category' => Technology::CATEGORY_DATABASE],
            ['name' => 'MySQL', 'slug' => 'mysql', 'category' => Technology::CATEGORY_DATABASE],
            ['name' => 'Supabase', 'slug' => 'supabase', 'category' => Technology::CATEGORY_DATABASE],
            ['name' => 'Firebase', 'slug' => 'firebase', 'category' => Technology::CATEGORY_DATABASE],
            ['name' => 'REST APIs', 'slug' => 'rest-apis', 'category' => Technology::CATEGORY_INTEGRATION],
            ['name' => 'WhatsApp Cloud API', 'slug' => 'whatsapp-cloud-api', 'category' => Technology::CATEGORY_INTEGRATION],
            ['name' => 'Pest', 'slug' => 'pest', 'category' => Technology::CATEGORY_QUALITY],
            ['name' => 'Playwright', 'slug' => 'playwright', 'category' => Technology::CATEGORY_QUALITY],
            ['name' => 'Git', 'slug' => 'git', 'category' => Technology::CATEGORY_TOOLING],
        ];

        foreach ($technologies as $index => $technology) {
            Technology::query()->create([
                ...$technology,
                'sort_order' => $index + 1,
            ]);
        }
    }
}
