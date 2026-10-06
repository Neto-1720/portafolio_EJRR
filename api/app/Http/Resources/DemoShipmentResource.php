<?php

namespace App\Http\Resources;

use App\Models\DemoShipment;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin DemoShipment */
class DemoShipmentResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'tracking_number' => $this->tracking_number,
            'customer' => $this->customer_name,
            'origin' => $this->origin,
            'destination' => $this->destination,
            'carrier' => $this->carrier,
            'status' => $this->status,
            'estimated_delivery' => $this->estimated_delivery?->toDateString(),
        ];
    }
}
