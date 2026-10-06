<?php

namespace Database\Factories;

use App\Models\DemoNotification;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<DemoNotification>
 */
class DemoNotificationFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'event' => 'shipment.status_changed',
            'channel' => DemoNotification::CHANNEL_EMAIL,
            'recipient' => fake()->unique()->numerify('aviso-##@acme-logistics.test'),
            'status' => DemoNotification::STATUS_PENDING,
            'sent_at' => null,
            'payload' => ['template' => 'status_update'],
        ];
    }
}
