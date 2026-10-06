<?php

namespace App\Http\Resources;

use App\Models\DemoConversation;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin DemoConversation */
class DemoConversationListResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'customer_name' => $this->customer_name,
            'customer_identifier' => $this->customer_identifier,
            'status' => $this->status,
            'assigned_to' => $this->assigned_to,
            'last_message_at' => $this->last_message_at?->toIso8601String(),
            'preview' => $this->latestMessage?->content,
        ];
    }
}
