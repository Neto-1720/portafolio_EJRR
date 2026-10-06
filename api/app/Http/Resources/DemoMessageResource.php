<?php

namespace App\Http\Resources;

use App\Models\DemoMessage;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin DemoMessage */
class DemoMessageResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'sender_type' => $this->sender_type,
            'content' => $this->content,
            'sent_at' => $this->sent_at?->toIso8601String(),
        ];
    }
}
