<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProjectImageRequest;
use App\Http\Resources\ProjectImageResource;
use App\Models\Project;
use App\Models\ProjectImage;
use App\Services\ProjectImageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Http\UploadedFile;

class ProjectImageController extends Controller
{
    public function __construct(private ProjectImageService $images) {}

    public function store(ProjectImageRequest $request, Project $project): JsonResponse
    {
        $this->authorize('update', $project);

        $file = $request->file('image');
        abort_unless($file instanceof UploadedFile, 422);

        $image = $this->images->store(
            $project,
            $file,
            $request->safe()->except('image'),
        );

        return (new ProjectImageResource($image))->response()->setStatusCode(201);
    }

    public function update(ProjectImageRequest $request, Project $project, ProjectImage $image): ProjectImageResource
    {
        $this->authorize('update', $project);
        abort_unless($image->project_id === $project->id, 404);

        return new ProjectImageResource(
            $this->images->update($image, $request->validated()),
        );
    }

    public function destroy(Project $project, ProjectImage $image): Response
    {
        $this->authorize('update', $project);
        abort_unless($image->project_id === $project->id, 404);

        $this->images->delete($image);

        return response()->noContent();
    }
}
