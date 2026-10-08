<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\ProjectImage;
use App\Models\User;
use App\Services\PortfolioStorage;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class MigrateMediaToSupabaseCommandTest extends TestCase
{
    use RefreshDatabase;

    private const BASE_URL = 'https://demo.supabase.co/storage/v1/object/public/portfolio';

    private string $localRoot;

    protected function setUp(): void
    {
        parent::setUp();

        $this->localRoot = storage_path('framework/testing/media-'.uniqid());
        File::ensureDirectoryExists($this->localRoot.'/projects/support');
        File::put($this->localRoot.'/projects/support/cover.webp', 'cover-bytes');
        File::put($this->localRoot.'/projects/support/01-chat-dark.webp', 'dark-bytes');

        config([
            'portfolio.media_disk' => 'supabase',
            'portfolio.local_media_root' => $this->localRoot,
        ]);
        Storage::fake('supabase', ['url' => self::BASE_URL]);
        Storage::fake('public');
    }

    protected function tearDown(): void
    {
        File::deleteDirectory($this->localRoot);

        parent::tearDown();
    }

    public function test_it_uploads_local_images_and_preserves_metadata(): void
    {
        $project = $this->project();
        $cover = $this->image($project, '/projects/support/cover.webp', 1, true, 'Portada', 'Caption portada');
        $dark = $this->image($project, '/projects/support/01-chat-dark.webp', 2, false, 'Oscuro', null);

        $this->artisan('portfolio:migrate-media-to-supabase')
            ->expectsOutputToContain('Subidos: 2 · Omitidos: 0 · Faltantes: 0 · Errores: 0')
            ->assertSuccessful();

        Storage::disk('supabase')->assertExists('projects/customer-support-desk/cover.webp');
        Storage::disk('supabase')->assertExists('projects/customer-support-desk/01-chat-dark.webp');
        $this->assertSame('cover-bytes', Storage::disk('supabase')->get('projects/customer-support-desk/cover.webp'));
        $this->assertFileExists($this->localRoot.'/projects/support/cover.webp');

        $cover->refresh();
        $dark->refresh();

        $this->assertSame('projects/customer-support-desk/cover.webp', $cover->path);
        $this->assertSame('Portada', $cover->alt_text);
        $this->assertSame('Caption portada', $cover->caption);
        $this->assertSame(1, $cover->sort_order);
        $this->assertTrue($cover->is_cover);
        $this->assertSame('projects/customer-support-desk/01-chat-dark.webp', $dark->path);
        $this->assertSame(2, $dark->sort_order);
        $this->assertFalse($dark->is_cover);
    }

    public function test_it_can_run_again_without_duplicating_files_or_rows(): void
    {
        $project = $this->project();
        $this->image($project, '/projects/support/cover.webp', 1, true);
        $this->image($project, '/projects/support/01-chat-dark.webp', 2, false);

        $this->artisan('portfolio:migrate-media-to-supabase')->assertSuccessful();

        $this->artisan('portfolio:migrate-media-to-supabase')
            ->expectsOutputToContain('Subidos: 0 · Omitidos: 2 · Faltantes: 0 · Errores: 0')
            ->assertSuccessful();

        $this->assertSame(2, ProjectImage::query()->count());
        $this->assertCount(2, Storage::disk('supabase')->allFiles());
    }

    public function test_it_reports_missing_files_without_touching_the_row(): void
    {
        $project = $this->project();
        $missing = $this->image($project, '/projects/support/no-existe.webp', 3, false);

        $this->artisan('portfolio:migrate-media-to-supabase')
            ->expectsOutputToContain('Subidos: 0 · Omitidos: 0 · Faltantes: 1 · Errores: 0')
            ->assertSuccessful();

        $this->assertSame('/projects/support/no-existe.webp', $missing->refresh()->path);
        $this->assertSame([], Storage::disk('supabase')->allFiles());
    }

    public function test_it_does_not_overwrite_a_different_remote_file(): void
    {
        $project = $this->project();
        $image = $this->image($project, '/projects/support/cover.webp', 1, true);
        Storage::disk('supabase')->put('projects/customer-support-desk/cover.webp', 'otro contenido distinto');

        $this->artisan('portfolio:migrate-media-to-supabase')
            ->expectsOutputToContain('Errores: 1')
            ->assertFailed();

        $this->assertSame('otro contenido distinto', Storage::disk('supabase')->get('projects/customer-support-desk/cover.webp'));
        $this->assertSame('/projects/support/cover.webp', $image->refresh()->path);
    }

    public function test_dry_run_does_not_upload_or_update(): void
    {
        $project = $this->project();
        $image = $this->image($project, '/projects/support/cover.webp', 1, true);

        $this->artisan('portfolio:migrate-media-to-supabase', ['--dry-run' => true])
            ->expectsOutputToContain('Subidos: 1 · Omitidos: 0 · Faltantes: 0 · Errores: 0')
            ->assertSuccessful();

        $this->assertSame([], Storage::disk('supabase')->allFiles());
        $this->assertSame('/projects/support/cover.webp', $image->refresh()->path);
    }

    public function test_api_returns_the_full_public_url_after_migration(): void
    {
        $project = $this->project();
        $this->image($project, '/projects/support/cover.webp', 1, true);

        $this->getJson('/api/projects/customer-support-desk')
            ->assertJsonPath('data.images.0.url', null);

        $this->artisan('portfolio:migrate-media-to-supabase')->assertSuccessful();

        $this->getJson('/api/projects/customer-support-desk')
            ->assertJsonPath('data.images.0.path', 'projects/customer-support-desk/cover.webp')
            ->assertJsonPath('data.images.0.url', self::BASE_URL.'/projects/customer-support-desk/cover.webp');
    }

    public function test_url_keeps_absolute_urls_without_concatenating_twice(): void
    {
        $url = self::BASE_URL.'/projects/customer-support-desk/cover.webp';

        $this->assertSame($url, app(PortfolioStorage::class)->url($url));
    }

    public function test_url_builds_the_public_url_without_checking_the_remote_file(): void
    {
        $storage = app(PortfolioStorage::class);

        $this->assertSame(
            self::BASE_URL.'/projects/customer-support-desk/sin-subir.webp',
            $storage->url('projects/customer-support-desk/sin-subir.webp'),
        );
        $this->assertNull($storage->url('/projects/support/cover.webp'));
        $this->assertNull($storage->url(null));
    }

    public function test_admin_upload_uses_the_configured_media_disk(): void
    {
        $user = User::factory()->create();
        $project = $this->project();

        $response = $this->actingAs($user)->post('/api/admin/projects/'.$project->id.'/images', [
            'image' => UploadedFile::fake()->image('nueva.webp'),
            'alt_text' => 'Nueva',
            'caption' => 'Caption nueva',
        ]);

        $response->assertCreated();
        $path = $response->json('data.path');

        $this->assertStringStartsWith('projects/customer-support-desk/', $path);
        Storage::disk('supabase')->assertExists($path);
        Storage::disk('public')->assertMissing($path);
        $this->assertSame(self::BASE_URL.'/'.$path, $response->json('data.url'));
    }

    private function project(): Project
    {
        return Project::query()->create([
            'slug' => 'customer-support-desk',
            'title' => 'Customer Support Desk',
            'summary' => 'Resumen de prueba.',
            'is_published' => true,
        ]);
    }

    private function image(Project $project, string $path, int $sort, bool $cover, ?string $alt = null, ?string $caption = null): ProjectImage
    {
        return $project->images()->create([
            'path' => $path,
            'alt_text' => $alt,
            'caption' => $caption,
            'sort_order' => $sort,
            'is_cover' => $cover,
        ]);
    }
}
