<?php

namespace App\Http\Controllers\Demo;

use App\Http\Controllers\Controller;
use App\Http\Resources\DemoConversationDetailResource;
use App\Http\Resources\DemoConversationListResource;
use App\Models\DemoConversation;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Validation\Rule;

class ConversationController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $validated = $request->validate([
            'search' => ['sometimes', 'nullable', 'string', 'max:120'],
        ]);

        $conversations = DemoConversation::query()
            ->with('latestMessage')
            ->when($validated['search'] ?? null, function ($query, string $search): void {
                $term = '%'.$search.'%';
                $query->where(function ($inner) use ($term): void {
                    $inner->whereLike('customer_name', $term)
                        ->orWhereLike('customer_identifier', $term);
                });
            })
            ->orderByDesc('last_message_at')
            ->orderByDesc('id')
            ->get();

        return DemoConversationListResource::collection($conversations);
    }

    public function show(DemoConversation $conversation): DemoConversationDetailResource
    {
        $conversation->load('messages');

        return new DemoConversationDetailResource($conversation);
    }

    public function update(Request $request, DemoConversation $conversation): DemoConversationDetailResource
    {
        $validated = $request->validate([
            'status' => ['required', 'string', Rule::in([
                DemoConversation::STATUS_OPEN,
                DemoConversation::STATUS_PENDING,
                DemoConversation::STATUS_CLOSED,
            ])],
        ]);

        $conversation->update([
            'status' => $validated['status'],
        ]);
        $conversation->load('messages');

        return new DemoConversationDetailResource($conversation);
    }
}
