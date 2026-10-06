<?php

namespace App\Http\Controllers\Demo;

use App\Http\Controllers\Controller;
use App\Http\Resources\DemoShipmentResource;
use App\Models\DemoShipment;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Validation\Rule;

class ShipmentController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $validated = $request->validate([
            'status' => ['sometimes', 'nullable', 'string', Rule::in($this->statuses())],
            'carrier' => ['sometimes', 'nullable', 'string', 'max:120'],
            'search' => ['sometimes', 'nullable', 'string', 'max:120'],
        ]);

        $shipments = DemoShipment::query()
            ->when($validated['status'] ?? null, fn ($query, string $status) => $query->where('status', $status))
            ->when($validated['carrier'] ?? null, fn ($query, string $carrier) => $query->where('carrier', $carrier))
            ->when($validated['search'] ?? null, function ($query, string $search): void {
                $term = '%'.$search.'%';
                $query->where(function ($inner) use ($term): void {
                    $inner->where('tracking_number', 'like', $term)
                        ->orWhere('customer_name', 'like', $term)
                        ->orWhere('origin', 'like', $term)
                        ->orWhere('destination', 'like', $term);
                });
            })
            ->orderBy('id')
            ->get();

        return DemoShipmentResource::collection($shipments)->additional([
            'meta' => [
                'total' => $shipments->count(),
                'in_transit' => $shipments->where('status', DemoShipment::STATUS_IN_TRANSIT)->count(),
                'delivered' => $shipments->where('status', DemoShipment::STATUS_DELIVERED)->count(),
                'exceptions' => $shipments->where('status', DemoShipment::STATUS_EXCEPTION)->count(),
                'carriers' => DemoShipment::query()->distinct()->orderBy('carrier')->pluck('carrier')->values(),
            ],
        ]);
    }

    /**
     * @return array<int, string>
     */
    private function statuses(): array
    {
        return [
            DemoShipment::STATUS_CREATED,
            DemoShipment::STATUS_PICKED_UP,
            DemoShipment::STATUS_IN_TRANSIT,
            DemoShipment::STATUS_OUT_FOR_DELIVERY,
            DemoShipment::STATUS_DELIVERED,
            DemoShipment::STATUS_EXCEPTION,
        ];
    }
}
