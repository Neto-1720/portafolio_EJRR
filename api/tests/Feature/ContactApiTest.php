<?php

namespace Tests\Feature;

use App\Jobs\SendContactNotification;
use App\Models\ContactMessage;
use App\Models\User;
use App\Services\ContactMailer;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use RuntimeException;
use Tests\TestCase;

class ContactApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_valid_contact_is_stored_and_queues_a_notification(): void
    {
        Queue::fake();

        $this->withHeader('User-Agent', 'PortfolioTest')
            ->postJson('/api/contact', $this->payload())
            ->assertCreated()
            ->assertExactJson([
                'message' => 'Mensaje recibido correctamente.',
            ]);

        $this->assertDatabaseHas('contact_messages', [
            'email' => 'ana@example.test',
            'subject' => 'Una oportunidad',
            'status' => ContactMessage::STATUS_NEW,
            'ip_address' => '127.0.0.1',
            'user_agent' => 'PortfolioTest',
        ]);

        Queue::assertPushed(SendContactNotification::class, function (SendContactNotification $job): bool {
            return $job->contact->email === 'ana@example.test';
        });
    }

    public function test_contact_validation_rejects_missing_fields_invalid_email_and_html(): void
    {
        $this->postJson('/api/contact', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['name', 'email', 'message']);

        $this->postJson('/api/contact', $this->payload(['email' => 'no-es-correo']))
            ->assertUnprocessable()
            ->assertJsonPath('errors.email.0', 'El correo no es válido.');

        $this->postJson('/api/contact', $this->payload([
            'message' => '<script>alert(1)</script> mensaje largo',
        ]))->assertUnprocessable()
            ->assertJsonValidationErrors('message');

        $this->postJson('/api/contact', $this->payload(['status' => 'archived']))
            ->assertUnprocessable();

        $this->assertDatabaseCount('contact_messages', 0);
    }

    public function test_honeypot_accepts_the_request_without_storing_or_queueing(): void
    {
        Queue::fake();

        $this->postJson('/api/contact', $this->payload(['website' => 'https://spam.test']))
            ->assertCreated()
            ->assertExactJson([
                'message' => 'Mensaje recibido correctamente.',
            ]);

        $this->assertDatabaseCount('contact_messages', 0);
        Queue::assertNothingPushed();
    }

    public function test_contact_is_rate_limited(): void
    {
        Queue::fake();

        for ($attempt = 0; $attempt < 5; $attempt++) {
            $this->postJson('/api/contact', $this->payload([
                'email' => "ana{$attempt}@example.test",
            ]))->assertCreated();
        }

        $this->postJson('/api/contact', $this->payload())
            ->assertTooManyRequests();
    }

    public function test_notification_job_sends_mail(): void
    {
        $contact = $this->storedMessage();
        $this->mock(ContactMailer::class, function ($mock) use ($contact): void {
            $mock->shouldReceive('send')->once()->with($contact);
        });

        $this->app->call([new SendContactNotification($contact), 'handle']);
    }

    public function test_mail_failure_keeps_the_stored_message(): void
    {
        $contact = $this->storedMessage();
        $failure = new RuntimeException('SMTP no disponible.');
        $this->mock(ContactMailer::class, function ($mock) use ($contact, $failure): void {
            $mock->shouldReceive('send')->times(3)->with($contact)->andThrow($failure);
        });
        $job = new SendContactNotification($contact);
        $this->assertInstanceOf(ShouldQueue::class, $job);
        $this->assertSame(3, $job->tries);

        for ($attempt = 0; $attempt < $job->tries; $attempt++) {
            try {
                $this->app->call([$job, 'handle']);
                $this->fail('El job debía propagar el fallo SMTP.');
            } catch (RuntimeException $exception) {
                $this->assertSame($failure, $exception);
            }
        }

        $this->assertModelExists($contact);
        $this->assertSame(ContactMessage::STATUS_NEW, $contact->fresh()->status);
    }

    public function test_admin_can_list_open_and_update_a_message(): void
    {
        $user = User::factory()->create();
        $contact = $this->storedMessage();

        $this->actingAs($user)
            ->getJson('/api/admin/messages')
            ->assertOk()
            ->assertJsonPath('data.0.email', 'ana@example.test')
            ->assertJsonMissingPath('data.0.message')
            ->assertJsonMissingPath('data.0.ip_address');

        $this->actingAs($user)
            ->getJson('/api/admin/messages/'.$contact->id)
            ->assertOk()
            ->assertJsonPath('data.message', 'Quiero conversar sobre un proyecto concreto.')
            ->assertJsonMissingPath('data.ip_address');

        $this->actingAs($user)
            ->patchJson('/api/admin/messages/'.$contact->id, ['status' => ContactMessage::STATUS_READ])
            ->assertOk()
            ->assertJsonPath('data.status', ContactMessage::STATUS_READ);

        $this->actingAs($user)
            ->patchJson('/api/admin/messages/'.$contact->id, ['status' => ContactMessage::STATUS_ARCHIVED])
            ->assertOk()
            ->assertJsonPath('data.status', ContactMessage::STATUS_ARCHIVED);

        $this->app['auth']->forgetGuards();
        $this->getJson('/api/admin/messages')->assertUnauthorized();
    }

    /**
     * @param  array<string, mixed>  $overrides
     * @return array<string, mixed>
     */
    private function payload(array $overrides = []): array
    {
        return [
            'name' => 'Ana Pérez',
            'email' => 'ana@example.test',
            'subject' => 'Una oportunidad',
            'message' => 'Quiero conversar sobre un proyecto concreto.',
            ...$overrides,
        ];
    }

    private function storedMessage(): ContactMessage
    {
        return ContactMessage::query()->create([
            'name' => 'Ana Pérez',
            'email' => 'ana@example.test',
            'subject' => 'Una oportunidad',
            'message' => 'Quiero conversar sobre un proyecto concreto.',
            'status' => ContactMessage::STATUS_NEW,
        ]);
    }
}
