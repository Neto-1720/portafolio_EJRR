<?php

namespace App\Http\Controllers\Demo;

use App\Http\Controllers\Controller;
use App\Http\Resources\DemoNotificationResource;
use App\Models\DemoNotification;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Validation\Rule;

class NotificationController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $validated = $request->validate([
            'channel' => ['sometimes', 'nullable', 'string', Rule::in([
                DemoNotification::CHANNEL_EMAIL,
                DemoNotification::CHANNEL_WHATSAPP,
            ])],
            'status' => ['sometimes', 'nullable', 'string', Rule::in([
                DemoNotification::STATUS_PENDING,
                DemoNotification::STATUS_SENT,
                DemoNotification::STATUS_FAILED,
            ])],
        ]);

        $notifications = DemoNotification::query()
            ->when($validated['channel'] ?? null, fn ($query, string $channel) => $query->where('channel', $channel))
            ->when($validated['status'] ?? null, fn ($query, string $status) => $query->where('status', $status))
            ->orderBy('id')
            ->get();

        return DemoNotificationResource::collection($notifications);
    }

    public function simulate(DemoNotification $notification): DemoNotificationResource
    {
        $notification->update([
            'status' => DemoNotification::STATUS_SENT,
            'sent_at' => now(),
        ]);

        return new DemoNotificationResource($notification);
    }
}
