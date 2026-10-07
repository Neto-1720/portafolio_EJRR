<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateContactMessageRequest;
use App\Http\Resources\AdminMessageListResource;
use App\Http\Resources\AdminMessageResource;
use App\Models\ContactMessage;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class MessageController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return AdminMessageListResource::collection(
            ContactMessage::query()->latest('id')->get(),
        );
    }

    public function show(ContactMessage $message): AdminMessageResource
    {
        return new AdminMessageResource($message);
    }

    public function update(UpdateContactMessageRequest $request, ContactMessage $message): AdminMessageResource
    {
        $message->update($request->safe()->only('status'));

        return new AdminMessageResource($message);
    }
}
