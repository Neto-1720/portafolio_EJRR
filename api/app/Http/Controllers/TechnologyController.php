<?php

namespace App\Http\Controllers;

use App\Http\Resources\TechnologyResource;
use App\Models\Technology;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class TechnologyController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $technologies = Technology::query()
            ->orderBy('category')
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get(['id', 'name', 'slug', 'category']);

        return TechnologyResource::collection($technologies);
    }
}
