<?php

namespace Database\Factories;

use App\Models\DemoConversation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<DemoConversation>
 */
class DemoConversationFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'customer_name' => 'Acme Logistics',
            'customer_identifier' => fake()->unique()->numerify('desk-##@acme-logistics.test'),
            'status' => DemoConversation::STATUS_OPEN,
            'assigned_to' => null,
            'last_message_at' => null,
        ];
    }
}
