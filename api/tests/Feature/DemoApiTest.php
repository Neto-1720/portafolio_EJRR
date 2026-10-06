<?php

namespace Tests\Feature;

use App\Models\DemoNotification;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DemoApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Model::preventLazyLoading();
        $this->seed();
    }

    public function test_shipments_index_returns_rows_and_counts(): void
    {
        $response = $this->getJson('/api/demo/shipments');

        $response->assertOk();
        $response->assertJsonCount(15, 'data');
        $response->assertJsonPath('meta.total', 15);
        $response->assertJsonPath('meta.in_transit', 3);
        $response->assertJsonPath('meta.delivered', 2);
        $response->assertJsonPath('meta.exceptions', 2);
        $response->assertJsonPath('data.0.tracking_number', 'ACME-0001');
        $response->assertJsonPath('data.0.customer', 'Acme Logistics');
        $this->assertSame([
            'id',
            'tracking_number',
            'customer',
            'origin',
            'destination',
            'carrier',
            'status',
            'estimated_delivery',
        ], array_keys($response->json('data.0')));
    }

    public function test_shipments_can_be_filtered(): void
    {
        $delivered = $this->getJson('/api/demo/shipments?status=delivered&carrier=Harbor+Line');

        $delivered->assertOk();
        $delivered->assertJsonPath('meta.total', 2);
        $delivered->assertJsonPath('data.0.status', 'delivered');
        $delivered->assertJsonPath('data.0.carrier', 'Harbor Line');

        $search = $this->getJson('/api/demo/shipments?search=ACME-0001');

        $search->assertOk();
        $search->assertJsonCount(1, 'data');
        $search->assertJsonPath('data.0.tracking_number', 'ACME-0001');
    }

    public function test_shipments_reject_an_unknown_status(): void
    {
        $this->getJson('/api/demo/shipments?status=lost')->assertUnprocessable();
    }

    public function test_notifications_index_filters_channel_and_status(): void
    {
        $response = $this->getJson('/api/demo/notifications?channel=email&status=pending');

        $response->assertOk();
        $response->assertJsonPath('data.0.channel', 'email');
        $response->assertJsonPath('data.0.status', 'pending');
        $response->assertJsonMissingPath('data.0.payload');
        $this->assertNotEmpty($response->json('data'));
    }

    public function test_simulate_marks_a_notification_sent_without_a_real_delivery(): void
    {
        $notification = DemoNotification::query()->where('status', 'pending')->firstOrFail();

        $response = $this->postJson('/api/demo/notifications/'.$notification->id.'/simulate');

        $response->assertOk();
        $response->assertJsonPath('data.status', 'sent');
        $this->assertNotNull($response->json('data.sent_at'));
        $this->assertDatabaseHas('demo_notifications', [
            'id' => $notification->id,
            'status' => 'sent',
        ]);
    }

    public function test_missing_notification_simulation_returns_not_found(): void
    {
        $this->postJson('/api/demo/notifications/9999/simulate')->assertNotFound();
    }

    public function test_conversations_index_and_detail(): void
    {
        $index = $this->getJson('/api/demo/conversations');

        $index->assertOk();
        $index->assertJsonCount(5, 'data');
        $this->assertNotNull($index->json('data.0.preview'));

        $id = $index->json('data.0.id');
        $detail = $this->getJson('/api/demo/conversations/'.$id);

        $detail->assertOk();
        $detail->assertJsonCount(4, 'data.messages');
        $detail->assertJsonPath('data.id', $id);
    }

    public function test_conversation_search_and_missing_detail(): void
    {
        $this->getJson('/api/demo/conversations?search=Northstar+Retail')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.customer_name', 'Northstar Retail');

        $this->getJson('/api/demo/conversations/9999')->assertNotFound();
    }

    public function test_conversation_status_can_be_updated(): void
    {
        $id = $this->getJson('/api/demo/conversations')->json('data.0.id');

        $response = $this->patchJson('/api/demo/conversations/'.$id, [
            'status' => 'closed',
            'assigned_to' => 'should-be-ignored',
        ]);

        $response->assertOk();
        $response->assertJsonPath('data.status', 'closed');
        $this->assertDatabaseHas('demo_conversations', [
            'id' => $id,
            'status' => 'closed',
        ]);
        $this->assertNotSame('should-be-ignored', $response->json('data.assigned_to'));
    }

    public function test_conversation_status_rejects_unknown_values(): void
    {
        $id = $this->getJson('/api/demo/conversations')->json('data.0.id');

        $this->patchJson('/api/demo/conversations/'.$id, [
            'status' => 'archived',
        ])->assertUnprocessable();
    }
}
