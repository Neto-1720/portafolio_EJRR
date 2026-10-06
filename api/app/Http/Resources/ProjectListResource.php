<?php

namespace App\Http\Resources;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Project */
class ProjectListResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $cover = $this->coverImage();

        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->title,
            'subtitle' => $this->subtitle,
            'summary' => $this->summary,
            'role' => $this->role,
            'period' => $this->period,
            'is_featured' => $this->is_featured,
            'cover_image' => $cover ? new ProjectImageResource($cover) : null,
            'technologies' => TechnologyResource::collection($this->technologies),
        ];
    }
}
