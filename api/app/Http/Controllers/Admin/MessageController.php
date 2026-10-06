<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\AdminMessageResource;
use App\Models\ContactMessage;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class MessageController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return AdminMessageResource::collection(
            ContactMessage::query()->latest('id')->get(),
        );
    }
}
