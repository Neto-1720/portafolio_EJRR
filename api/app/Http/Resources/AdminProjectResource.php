<?php

namespace App\Http\Resources;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Project */
class AdminProjectResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->title,
            'subtitle' => $this->subtitle,
            'summary' => $this->summary,
            'context' => $this->context,
            'problem' => $this->problem,
            'solution' => $this->solution,
            'responsibilities' => $this->responsibilities,
            'technical_decisions' => $this->technical_decisions,
            'challenges' => $this->challenges,
            'results' => $this->results,
            'learnings' => $this->learnings,
            'role' => $this->role,
            'period' => $this->period,
            'is_featured' => $this->is_featured,
            'is_published' => $this->is_published,
            'sort_order' => $this->sort_order,
            'technology_ids' => $this->technologies->pluck('id')->values(),
            'images' => ProjectImageResource::collection($this->images),
        ];
    }
}
