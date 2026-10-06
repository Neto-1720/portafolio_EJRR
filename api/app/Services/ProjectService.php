<?php

namespace App\Services;

use App\Models\Project;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ProjectService
{
    /**
     * @return Collection<int, Project>
     */
    public function listPublished(bool $featuredOnly): Collection
    {
        return Project::query()
            ->published()
            ->when($featuredOnly, fn ($query) => $query->featured())
            ->ordered()
            ->with([
                'technologies:id,name,slug,category',
                'images',
            ])
            ->get([
                'id',
                'slug',
                'title',
                'subtitle',
                'summary',
                'role',
                'period',
                'is_featured',
                'sort_order',
            ]);
    }

    public function publishedDetail(Project $project): Project
    {
        if (! $project->is_published) {
            throw (new ModelNotFoundException)->setModel(Project::class, [$project->slug]);
        }

        return $project->load([
            'technologies:id,name,slug,category',
            'images',
        ]);
    }
}
