<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use RuntimeException;

class PortfolioStorage
{
    public function diskName(): string
    {
        return (string) config('portfolio.media_disk', 'public');
    }

    public function store(UploadedFile $file, string $directory): string
    {
        $path = $file->store($directory, $this->diskName());

        if (! is_string($path) || $path === '') {
            throw new RuntimeException('No se pudo guardar la imagen.');
        }

        return $path;
    }

    public function delete(string $path): void
    {
        $disk = Storage::disk($this->diskName());

        if (! $disk->exists($path)) {
            return;
        }

        if (! $disk->delete($path)) {
            throw new RuntimeException('No se pudo eliminar la imagen.');
        }
    }

    public function url(?string $path): ?string
    {
        if ($path === null || $path === '') {
            return null;
        }

        $disk = Storage::disk($this->diskName());

        if (! $disk->exists($path)) {
            return null;
        }

        return $disk->url($path);
    }
}
