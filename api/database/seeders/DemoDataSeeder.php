<?php

namespace Database\Seeders;

use App\Models\DemoConversation;
use App\Models\DemoMessage;
use App\Models\DemoNotification;
use App\Models\DemoShipment;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Database\Seeder;

class DemoDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->seedShipments();
        $this->seedNotifications();
        $this->seedConversations();
    }

    private function seedShipments(): void
    {
        $statuses = [
            DemoShipment::STATUS_CREATED,
            DemoShipment::STATUS_PICKED_UP,
            DemoShipment::STATUS_IN_TRANSIT,
            DemoShipment::STATUS_OUT_FOR_DELIVERY,
            DemoShipment::STATUS_DELIVERED,
            DemoShipment::STATUS_EXCEPTION,
        ];

        $customers = ['Acme Logistics', 'Nova Commerce', 'Northstar Retail'];
        $carriers = ['Atlas Freight', 'Harbor Line', 'Cinder Post'];
        $routes = [
            ['Guadalajara', 'Monterrey'],
            ['Puebla', 'Querétaro'],
            ['León', 'Mérida'],
        ];

        DemoShipment::factory()
            ->count(15)
            ->sequence(fn (Sequence $sequence) => $this->shipmentAttributes($sequence, $statuses, $customers, $carriers, $routes))
            ->create();
    }

    /**
     * @param  array<int, string>  $statuses
     * @param  array<int, string>  $customers
     * @param  array<int, string>  $carriers
     * @param  array<int, array{0: string, 1: string}>  $routes
     * @return array<string, mixed>
     */
    private function shipmentAttributes(Sequence $sequence, array $statuses, array $customers, array $carriers, array $routes): array
    {
        $status = $statuses[$sequence->index % count($statuses)];
        $route = $routes[$sequence->index % count($routes)];

        return [
            'tracking_number' => sprintf('ACME-%04d', $sequence->index + 1),
            'customer_name' => $customers[$sequence->index % count($customers)],
            'origin' => $route[0],
            'destination' => $route[1],
            'carrier' => $carriers[$sequence->index % count($carriers)],
            'status' => $status,
            'estimated_delivery' => $status === DemoShipment::STATUS_EXCEPTION
                ? null
                : now()->addDays(($sequence->index % 5) + 1)->toDateString(),
        ];
    }

    private function seedNotifications(): void
    {
        $statuses = [
            DemoNotification::STATUS_PENDING,
            DemoNotification::STATUS_SENT,
            DemoNotification::STATUS_FAILED,
        ];

        DemoNotification::factory()
            ->count(10)
            ->sequence(fn (Sequence $sequence) => $this->notificationAttributes($sequence, $statuses))
            ->create();
    }

    /**
     * @param  array<int, string>  $statuses
     * @return array<string, mixed>
     */
    private function notificationAttributes(Sequence $sequence, array $statuses): array
    {
        $status = $statuses[$sequence->index % count($statuses)];

        return [
            'event' => $sequence->index % 2 === 0 ? 'shipment.status_changed' : 'conversation.opened',
            'channel' => $sequence->index % 2 === 0
                ? DemoNotification::CHANNEL_EMAIL
                : DemoNotification::CHANNEL_WHATSAPP,
            'recipient' => sprintf('aviso-%02d@acme-logistics.test', $sequence->index + 1),
            'status' => $status,
            'sent_at' => $status === DemoNotification::STATUS_SENT
                ? now()->subMinutes($sequence->index + 1)
                : null,
            'payload' => ['reference' => sprintf('ACME-%04d', $sequence->index + 1)],
        ];
    }

    private function seedConversations(): void
    {
        $customers = ['Acme Logistics', 'Nova Commerce', 'Northstar Retail', 'Acme Logistics', 'Nova Commerce'];
        $statuses = [
            DemoConversation::STATUS_OPEN,
            DemoConversation::STATUS_PENDING,
            DemoConversation::STATUS_CLOSED,
            DemoConversation::STATUS_OPEN,
            DemoConversation::STATUS_PENDING,
        ];
        $senders = [
            DemoMessage::SENDER_CUSTOMER,
            DemoMessage::SENDER_BOT,
            DemoMessage::SENDER_AGENT,
            DemoMessage::SENDER_SYSTEM,
        ];

        foreach ($customers as $index => $customer) {
            $conversation = DemoConversation::factory()->create([
                'customer_name' => $customer,
                'customer_identifier' => sprintf('desk-%02d@northstar-retail.test', $index + 1),
                'status' => $statuses[$index],
                'assigned_to' => $statuses[$index] === DemoConversation::STATUS_CLOSED ? null : 'Mesa de guardia',
            ]);

            $messages = collect($senders)->map(function (string $sender, int $messageIndex) use ($conversation, $index) {
                return DemoMessage::factory()->make([
                    'conversation_id' => $conversation->id,
                    'sender_type' => $sender,
                    'content' => $this->messageContent($sender),
                    'sent_at' => now()->subHours(20 - ($index * 4) - $messageIndex),
                ]);
            });

            $conversation->messages()->saveMany($messages);
            $conversation->update([
                'last_message_at' => $messages->max('sent_at'),
            ]);
        }
    }

    private function messageContent(string $sender): string
    {
        return match ($sender) {
            DemoMessage::SENDER_CUSTOMER => 'Quiero saber dónde va la guía ACME-0001.',
            DemoMessage::SENDER_BOT => 'Puedo revisar el estado si confirmas el número de guía.',
            DemoMessage::SENDER_AGENT => 'La guía sigue en tránsito entre origen y destino.',
            default => 'La conversación quedó registrada en la mesa.',
        };
    }
}
