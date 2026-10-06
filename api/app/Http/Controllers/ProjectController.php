<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProjectDetailResource;
use App\Http\Resources\ProjectListResource;
use App\Models\Project;
use App\Services\ProjectService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProjectController extends Controller
{
    public function __construct(private ProjectService $projects) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        return ProjectListResource::collection(
            $this->projects->listPublished($request->query('featured') === '1'),
        );
    }

    public function show(Project $project): ProjectDetailResource
    {
        return new ProjectDetailResource($this->projects->publishedDetail($project));
    }
}
