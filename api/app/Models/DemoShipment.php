<?php

namespace App\Models;

use Database\Factories\DemoShipmentFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'tracking_number',
    'customer_name',
    'origin',
    'destination',
    'carrier',
    'status',
    'estimated_delivery',
])]
class DemoShipment extends Model
{
    /** @use HasFactory<DemoShipmentFactory> */
    use HasFactory;

    public const STATUS_CREATED = 'created';

    public const STATUS_PICKED_UP = 'picked_up';

    public const STATUS_IN_TRANSIT = 'in_transit';

    public const STATUS_OUT_FOR_DELIVERY = 'out_for_delivery';

    public const STATUS_DELIVERED = 'delivered';

    public const STATUS_EXCEPTION = 'exception';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'estimated_delivery' => 'date',
        ];
    }
}
