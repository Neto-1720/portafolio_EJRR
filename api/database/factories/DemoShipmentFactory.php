<?php

namespace Database\Factories;

use App\Models\DemoShipment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<DemoShipment>
 */
class DemoShipmentFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'tracking_number' => fake()->unique()->numerify('ACME-####'),
            'customer_name' => fake()->randomElement([
                'Acme Logistics',
                'Nova Commerce',
                'Northstar Retail',
            ]),
            'origin' => fake()->randomElement(['Guadalajara', 'Monterrey', 'Puebla']),
            'destination' => fake()->randomElement(['Querétaro', 'León', 'Mérida']),
            'carrier' => fake()->randomElement(['Atlas Freight', 'Harbor Line', 'Cinder Post']),
            'status' => DemoShipment::STATUS_CREATED,
            'estimated_delivery' => now()->addDays(3)->toDateString(),
        ];
    }
}
