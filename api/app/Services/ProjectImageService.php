<?php

namespace App\Services;

use App\Models\Project;
use App\Models\ProjectImage;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class ProjectImageService
{
    public function __construct(private PortfolioStorage $storage) {}

    /**
     * @param  array{alt_text?: string|null, caption?: string|null, sort_order?: int|null, is_cover?: bool|null}  $attributes
     */
    public function store(Project $project, UploadedFile $file, array $attributes): ProjectImage
    {
        $path = $this->storage->store($file, 'projects/'.$project->id);

        try {
            return DB::transaction(function () use ($project, $path, $attributes) {
                $makeCover = $this->wantsCover($attributes['is_cover'] ?? false)
                    || ! $project->images()->exists();

                if ($makeCover) {
                    $project->images()->update(['is_cover' => false]);
                }

                return $project->images()->create([
                    'path' => $path,
                    'alt_text' => $attributes['alt_text'] ?? null,
                    'caption' => $attributes['caption'] ?? null,
                    'sort_order' => $attributes['sort_order'] ?? 0,
                    'is_cover' => $makeCover,
                ]);
            });
        } catch (\Throwable $exception) {
            $this->storage->delete($path);

            throw $exception;
        }
    }

    /**
     * @param  array{alt_text?: string|null, caption?: string|null, sort_order?: int|null, is_cover?: bool|null}  $attributes
     */
    public function update(ProjectImage $image, array $attributes): ProjectImage
    {
        return DB::transaction(function () use ($image, $attributes) {
            if ($this->wantsCover($attributes['is_cover'] ?? false)) {
                $image->project->images()->whereKeyNot($image->id)->update(['is_cover' => false]);
            }

            if (array_key_exists('is_cover', $attributes)) {
                $attributes['is_cover'] = $this->wantsCover($attributes['is_cover']);
            }

            $image->update($attributes);

            return $image->refresh();
        });
    }

    public function delete(ProjectImage $image): void
    {
        $path = $image->path;
        $image->delete();
        $this->storage->delete($path);
    }

    private function wantsCover(mixed $value): bool
    {
        return filter_var($value, FILTER_VALIDATE_BOOLEAN);
    }

    public function deleteStoredFiles(Project $project): void
    {
        $project->loadMissing('images');

        foreach ($project->images as $image) {
            $this->storage->delete($image->path);
        }
    }
}
