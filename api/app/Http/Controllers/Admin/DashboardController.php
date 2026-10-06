<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Certification;
use App\Models\Project;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function __invoke(): JsonResponse
    {
        return response()->json([
            'data' => [
                'projects' => Project::query()->count(),
                'published_projects' => Project::query()->published()->count(),
                'featured_projects' => Project::query()->featured()->count(),
                'certifications' => Certification::query()->count(),
            ],
        ]);
    }
}
