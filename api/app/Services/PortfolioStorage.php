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

        if (str_starts_with($path, 'https://') || str_starts_with($path, 'http://')) {
            return $path;
        }

        // "/projects/..." apunta a web/public; el frontend usa el path tal cual.
        if (str_starts_with($path, '/')) {
            return null;
        }

        try {
            return Storage::disk($this->diskName())->url($path);
        } catch (RuntimeException) {
            return null;
        }
    }
}
