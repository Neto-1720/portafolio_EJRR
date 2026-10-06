<?php

namespace Database\Factories;

use App\Models\DemoConversation;
use App\Models\DemoMessage;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<DemoMessage>
 */
class DemoMessageFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'conversation_id' => DemoConversation::factory(),
            'sender_type' => DemoMessage::SENDER_CUSTOMER,
            'content' => '¿Pueden confirmar el estado de la guía?',
            'sent_at' => now(),
        ];
    }
}
