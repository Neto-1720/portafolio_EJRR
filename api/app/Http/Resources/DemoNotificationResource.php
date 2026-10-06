<?php

namespace App\Http\Resources;

use App\Models\DemoNotification;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin DemoNotification */
class DemoNotificationResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'event' => $this->event,
            'channel' => $this->channel,
            'recipient' => $this->recipient,
            'status' => $this->status,
            'sent_at' => $this->sent_at?->toIso8601String(),
        ];
    }
}
