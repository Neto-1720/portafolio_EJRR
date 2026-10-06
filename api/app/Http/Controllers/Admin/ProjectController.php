<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProjectRequest;
use App\Http\Resources\AdminProjectListResource;
use App\Http\Resources\AdminProjectResource;
use App\Models\Project;
use App\Services\ProjectImageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class ProjectController extends Controller
{
    public function __construct(private ProjectImageService $images) {}

    public function index(): AnonymousResourceCollection
    {
        $this->authorize('viewAny', Project::class);

        return AdminProjectListResource::collection(
            Project::query()->ordered()->get(),
        );
    }

    public function show(Project $project): AdminProjectResource
    {
        $this->authorize('view', $project);

        return new AdminProjectResource($project->load(['technologies', 'images']));
    }

    public function store(ProjectRequest $request): JsonResponse
    {
        $this->authorize('create', Project::class);

        $project = Project::query()->create($this->attributes($request));
        $this->syncTechnologies($project, $request);

        return AdminProjectResource::make($project->load(['technologies', 'images']))
            ->response()
            ->setStatusCode(201);
    }

    public function update(ProjectRequest $request, Project $project): AdminProjectResource
    {
        $this->authorize('update', $project);

        $project->update($this->attributes($request));
        $this->syncTechnologies($project, $request);

        return new AdminProjectResource($project->load(['technologies', 'images']));
    }

    public function destroy(Project $project): Response
    {
        $this->authorize('delete', $project);

        $this->images->deleteStoredFiles($project);
        $project->delete();

        return response()->noContent();
    }

    /**
     * @return array<string, mixed>
     */
    private function attributes(ProjectRequest $request): array
    {
        return $request->safe()->except('technology_ids');
    }

    private function syncTechnologies(Project $project, ProjectRequest $request): void
    {
        if ($request->exists('technology_ids')) {
            $project->technologies()->sync($request->validated('technology_ids'));
        }
    }
}
