<?php

namespace Tests\Feature;

use App\Models\Certification;
use App\Models\Project;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicPortfolioApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Model::preventLazyLoading();
    }

    public function test_projects_index_returns_published_cards_in_order(): void
    {
        $this->seed();
        $this->createDraft();

        $response = $this->getJson('/api/projects');

        $response->assertOk();
        $response->assertJsonCount(5, 'data');
        $response->assertJsonPath('data.0.slug', 'saas-logistics-platform');
        $response->assertJsonPath('data.0.cover_image.path', 'projects/saas-logistics-platform/cover.webp');
        $response->assertJsonPath('data.4.slug', 'legacy-modernization');

        $card = $response->json('data.0');
        $this->assertSame([
            'id',
            'slug',
            'title',
            'subtitle',
            'summary',
            'role',
            'period',
            'is_featured',
            'cover_image',
            'technologies',
        ], array_keys($card));
        $this->assertNotEmpty($card['technologies']);
        $this->assertArrayNotHasKey('pivot', $card['technologies'][0]);
        $this->assertNotContains('borrador', collect($response->json('data'))->pluck('slug'));
    }

    public function test_featured_filter_returns_only_featured_published_projects(): void
    {
        $this->seed();
        $this->createDraft(isFeatured: true);

        $response = $this->getJson('/api/projects?featured=1');

        $response->assertOk();
        $response->assertJsonPath('data.*.slug', [
            'saas-logistics-platform',
            'multichannel-notifications',
            'customer-support-desk',
        ]);
        $response->assertJsonMissing(['slug' => 'borrador']);
    }

    public function test_project_detail_includes_copy_technologies_and_images(): void
    {
        $this->seed();

        $response = $this->getJson('/api/projects/saas-logistics-platform');

        $response->assertOk();
        $response->assertJsonPath('data.slug', 'saas-logistics-platform');
        $response->assertJsonPath('data.images.0.is_cover', true);
        $this->assertNotEmpty($response->json('data.context'));
        $this->assertNotEmpty($response->json('data.technologies'));
        $this->assertNotEmpty($response->json('data.images'));
        $this->assertArrayNotHasKey('cover_image', $response->json('data'));
    }

    public function test_missing_and_unpublished_projects_return_not_found(): void
    {
        $this->seed();
        $this->createDraft();

        $this->getJson('/api/projects/no-existe')->assertNotFound();
        $this->getJson('/api/projects/borrador')->assertNotFound();
    }

    public function test_cover_image_falls_back_and_can_be_null(): void
    {
        Project::query()->create([
            'slug' => 'sin-portada',
            'title' => 'Sin portada',
            'summary' => 'No tiene imagen marcada como portada.',
            'is_published' => true,
            'sort_order' => 1,
        ])->images()->createMany([
            ['path' => 'segunda.webp', 'sort_order' => 2, 'is_cover' => false],
            ['path' => 'primera.webp', 'sort_order' => 1, 'is_cover' => false],
        ]);

        Project::query()->create([
            'slug' => 'sin-imagen',
            'title' => 'Sin imagen',
            'summary' => 'No tiene imágenes.',
            'is_published' => true,
            'sort_order' => 2,
        ]);

        $index = $this->getJson('/api/projects');

        $index->assertOk();
        $index->assertJsonPath('data.0.cover_image.path', 'primera.webp');
        $index->assertJsonPath('data.1.cover_image', null);

        $this->getJson('/api/projects/sin-portada')
            ->assertOk()
            ->assertJsonPath('data.images.0.path', 'primera.webp');
    }

    public function test_technologies_are_ordered_without_pivot_data(): void
    {
        $this->seed();

        $response = $this->getJson('/api/technologies');

        $response->assertOk();
        $response->assertJsonCount(15, 'data');
        $response->assertJsonPath('data.0.slug', 'laravel');
        $response->assertJsonPath('data.0.category', 'backend');
        $response->assertJsonPath('data.1.slug', 'php');
        $this->assertArrayNotHasKey('pivot', $response->json('data.0'));
        $this->assertSame(
            ['id', 'name', 'slug', 'category'],
            array_keys($response->json('data.0')),
        );
    }

    public function test_certifications_are_published_and_allow_null_issuer(): void
    {
        $this->seed();

        Certification::query()->create([
            'name' => 'Oculta',
            'issuer' => null,
            'is_published' => false,
            'sort_order' => 0,
        ]);
        Certification::query()->create([
            'name' => 'Antigua',
            'issuer' => null,
            'issued_at' => '2020-01-01',
            'is_published' => true,
            'sort_order' => 10,
        ]);
        Certification::query()->create([
            'name' => 'Reciente',
            'issuer' => null,
            'issued_at' => '2024-06-01',
            'is_published' => true,
            'sort_order' => 10,
        ]);

        $response = $this->getJson('/api/certifications');

        $response->assertOk();
        $response->assertJsonPath('data.0.name', 'React para principiantes');
        $response->assertJsonPath('data.0.issuer', null);
        $response->assertJsonPath('data.0.issued_at', null);
        $response->assertJsonPath('data.2.name', 'Reciente');
        $response->assertJsonPath('data.2.issued_at', '2024-06-01');
        $response->assertJsonPath('data.3.name', 'Antigua');
        $response->assertJsonMissing(['name' => 'Oculta']);
        $this->assertSame([
            'id',
            'name',
            'issuer',
            'issued_at',
            'credential_url',
            'image_path',
        ], array_keys($response->json('data.0')));
    }

    private function createDraft(bool $isFeatured = false): Project
    {
        return Project::query()->create([
            'slug' => 'borrador',
            'title' => 'Borrador',
            'summary' => 'No debe aparecer en la API pública.',
            'is_featured' => $isFeatured,
            'is_published' => false,
            'sort_order' => 0,
        ]);
    }
}
