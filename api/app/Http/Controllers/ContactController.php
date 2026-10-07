<?php

namespace App\Http\Controllers;

use App\Http\Requests\ContactRequest;
use App\Jobs\SendContactNotification;
use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;

class ContactController extends Controller
{
    public function store(ContactRequest $request): JsonResponse
    {
        if (filled(trim((string) $request->input('website', '')))) {
            return $this->received();
        }

        $message = ContactMessage::query()->create([
            'name' => $request->validated('name'),
            'email' => $request->validated('email'),
            'subject' => $request->validated('subject'),
            'message' => $request->validated('message'),
            'status' => ContactMessage::STATUS_NEW,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        SendContactNotification::dispatch($message);

        return $this->received();
    }

    private function received(): JsonResponse
    {
        return response()->json([
            'message' => 'Mensaje recibido correctamente.',
        ], 201);
    }
}
