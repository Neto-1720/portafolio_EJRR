<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\Technology;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AdminApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_accepts_valid_credentials_and_rejects_invalid_ones(): void
    {
        $user = User::factory()->create();

        $this->fromFrontend()->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'password',
        ])->assertNoContent();

        $this->assertAuthenticated();

        $this->fromFrontend()->postJson('/api/logout')->assertNoContent();
        $this->app['auth']->forgetGuards();
        $this->getJson('/api/user')->assertUnauthorized();

        $this->fromFrontend()->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'incorrecta',
        ])->assertUnprocessable()
            ->assertJsonValidationErrors('email');

        $this->assertGuest();
    }

    public function test_admin_routes_require_authentication(): void
    {
        $this->getJson('/api/admin/projects')->assertUnauthorized();
        $this->getJson('/api/user')->assertUnauthorized();
    }

    public function test_admin_can_list_and_update_a_project(): void
    {
        $user = User::factory()->create();
        $project = $this->project();
        $technology = Technology::query()->create([
            'name' => 'Laravel',
            'slug' => 'laravel',
            'category' => 'backend',
            'sort_order' => 1,
        ]);

        $this->actingAs($user)
            ->getJson('/api/admin/projects')
            ->assertOk()
            ->assertJsonPath('data.0.title', 'Borrador');

        $this->actingAs($user)
            ->putJson('/api/admin/projects/'.$project->id, [
                'title' => 'Borrador editado',
                'slug' => 'borrador-editado',
                'summary' => 'Resumen nuevo.',
                'is_published' => true,
                'is_featured' => false,
                'sort_order' => 4,
                'technology_ids' => [$technology->id],
            ])
            ->assertOk()
            ->assertJsonPath('data.slug', 'borrador-editado')
            ->assertJsonPath('data.technology_ids.0', $technology->id);

        $this->assertDatabaseHas('project_technology', [
            'project_id' => $project->id,
            'technology_id' => $technology->id,
        ]);
    }

    public function test_project_validation_rejects_a_duplicate_slug(): void
    {
        $user = User::factory()->create();
        $this->project(['slug' => 'existente']);
        $other = $this->project(['slug' => 'otro']);

        $this->actingAs($user)
            ->putJson('/api/admin/projects/'.$other->id, [
                'slug' => 'existente',
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('slug');

        $this->actingAs($user)
            ->putJson('/api/admin/projects/'.$other->id, [
                'title' => '',
            ])
            ->assertUnprocessable()
            ->assertJsonPath('errors.title.0', 'El título es obligatorio.');
    }

    public function test_certifications_can_be_created_updated_and_deleted(): void
    {
        $user = User::factory()->create();

        $created = $this->actingAs($user)->postJson('/api/admin/certifications', [
            'name' => 'Curso de prueba',
            'issuer' => null,
            'is_published' => false,
            'sort_order' => 2,
        ]);

        $created->assertCreated();
        $id = $created->json('data.id');

        $this->actingAs($user)
            ->patchJson('/api/admin/certifications/'.$id, [
                'is_published' => true,
            ])
            ->assertOk()
            ->assertJsonPath('data.is_published', true);

        $this->actingAs($user)
            ->deleteJson('/api/admin/certifications/'.$id)
            ->assertNoContent();

        $this->assertDatabaseMissing('certifications', ['id' => $id]);
    }

    public function test_image_upload_keeps_a_single_cover_and_deletes_the_file(): void
    {
        Storage::fake('public');
        $user = User::factory()->create();
        $project = $this->project();

        $first = $this->actingAs($user)->post('/api/admin/projects/'.$project->id.'/images', [
            'image' => UploadedFile::fake()->image('one.jpg'),
            'alt_text' => 'Primera',
            'is_cover' => '1',
        ]);
        $first->assertCreated();

        $second = $this->actingAs($user)->post('/api/admin/projects/'.$project->id.'/images', [
            'image' => UploadedFile::fake()->image('two.png'),
            'alt_text' => 'Segunda',
            'is_cover' => '1',
            'sort_order' => '3',
        ]);
        $second->assertCreated();
        $this->assertSame(3, $second->json('data.sort_order'));

        $project->refresh();
        $this->assertSame(1, $project->images()->where('is_cover', true)->count());
        $this->assertTrue($project->images()->where('alt_text', 'Segunda')->firstOrFail()->is_cover);
        $this->assertNotNull($second->json('data.url'));

        $image = $project->images()->where('alt_text', 'Primera')->firstOrFail();
        Storage::disk('public')->assertExists($image->path);

        $this->actingAs($user)
            ->deleteJson('/api/admin/projects/'.$project->id.'/images/'.$image->id)
            ->assertNoContent();

        Storage::disk('public')->assertMissing($image->path);
        $this->assertDatabaseMissing('project_images', ['id' => $image->id]);
    }

    public function test_create_admin_command_hashes_the_password_and_does_not_print_it(): void
    {
        $password = 'clave-secreta';

        $this->artisan('portfolio:create-admin')
            ->expectsQuestion('Name', 'Ernesto')
            ->expectsQuestion('Email', 'admin@example.com')
            ->expectsQuestion('Password', $password)
            ->expectsQuestion('Confirm password', $password)
            ->expectsOutput('Administrador creado.')
            ->doesntExpectOutput($password)
            ->assertSuccessful();

        $user = User::query()->where('email', 'admin@example.com')->firstOrFail();
        $this->assertTrue(Hash::check($password, $user->password));
        $this->assertNotSame($password, $user->password);
    }

    private function fromFrontend(): static
    {
        return $this->withHeader('Origin', 'http://localhost:5173')
            ->withHeader('Referer', 'http://localhost:5173/');
    }

    /**
     * @param  array<string, mixed>  $overrides
     */
    private function project(array $overrides = []): Project
    {
        return Project::query()->create(array_merge([
            'slug' => 'borrador',
            'title' => 'Borrador',
            'summary' => 'Resumen.',
            'is_published' => false,
            'is_featured' => false,
            'sort_order' => 1,
        ], $overrides));
    }
}
