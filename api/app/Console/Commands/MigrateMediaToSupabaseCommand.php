<?php

namespace App\Console\Commands;

use App\Models\ProjectImage;
use App\Services\PortfolioStorage;
use Illuminate\Console\Command;
use Illuminate\Contracts\Filesystem\Filesystem;
use Illuminate\Http\File;
use Illuminate\Support\Facades\Storage;
use Throwable;

class MigrateMediaToSupabaseCommand extends Command
{
    protected $signature = 'portfolio:migrate-media-to-supabase
        {--dry-run : Muestra el plan sin subir archivos ni tocar la base}';

    protected $description = 'Sube las imágenes de project_images al disco de medios y normaliza su path';

    /** @var array{uploaded: int, skipped: int, missing: int, errors: int} */
    private array $summary = ['uploaded' => 0, 'skipped' => 0, 'missing' => 0, 'errors' => 0];

    /** @var array<int, array<int, string>> */
    private array $rows = [];

    public function handle(PortfolioStorage $storage): int
    {
        $this->summary = ['uploaded' => 0, 'skipped' => 0, 'missing' => 0, 'errors' => 0];
        $this->rows = [];
        $diskName = $storage->diskName();

        if ($diskName === 'public') {
            $this->error('PORTFOLIO_MEDIA_DISK es "public": no hay disco remoto al cual migrar.');

            return self::FAILURE;
        }

        $disk = Storage::disk($diskName);
        $dryRun = (bool) $this->option('dry-run');

        $this->info(($dryRun ? '[dry-run] ' : '')."Disco destino: {$diskName}");

        $claimed = ProjectImage::query()->pluck('id', 'path')->all();

        ProjectImage::query()
            ->with('project:id,slug')
            ->orderBy('project_id')
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get()
            ->each(function (ProjectImage $image) use ($disk, $dryRun, &$claimed): void {
                try {
                    $this->migrate($image, $disk, $dryRun, $claimed);
                } catch (Throwable $exception) {
                    $this->record($image, '-', 'errors', 'error: '.$exception->getMessage());
                }
            });

        $this->table(['id', 'proyecto', 'path actual', 'destino', 'resultado'], $this->rows);
        $this->line(sprintf(
            'Subidos: %d · Omitidos: %d · Faltantes: %d · Errores: %d',
            $this->summary['uploaded'],
            $this->summary['skipped'],
            $this->summary['missing'],
            $this->summary['errors'],
        ));

        return $this->summary['errors'] > 0 ? self::FAILURE : self::SUCCESS;
    }

    /**
     * @param  array<string, int>  $claimed
     */
    private function migrate(ProjectImage $image, Filesystem $disk, bool $dryRun, array &$claimed): void
    {
        $path = $image->path;

        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            $this->record($image, '-', 'errors', 'error: el path es una URL absoluta');

            return;
        }

        $target = 'projects/'.$image->project->slug.'/'.basename($path);

        if (isset($claimed[$target]) && $claimed[$target] !== $image->id) {
            $this->record($image, $target, 'errors', "error: el destino ya pertenece a la imagen {$claimed[$target]}");

            return;
        }

        $claimed[$target] = $image->id;

        $source = $this->localSource($path);
        $remoteExists = $disk->exists($target);

        if ($remoteExists && $source !== null && $disk->size($target) !== filesize($source)) {
            $this->record($image, $target, 'errors', 'error: el archivo remoto existe y es distinto; no se sobrescribe');

            return;
        }

        if (! $remoteExists && $source === null) {
            $this->record($image, $target, 'missing', 'faltante: no hay archivo local ni remoto');

            return;
        }

        $needsPath = $path !== $target;

        if ($remoteExists) {
            if ($needsPath && ! $dryRun) {
                $this->updatePath($image, $target);
            }

            $this->record($image, $target, 'skipped', $needsPath ? 'ya estaba en el disco; path normalizado' : 'ya migrada');

            return;
        }

        if (! $dryRun) {
            $stored = $disk->putFileAs(dirname($target), new File($source), basename($target));

            if ($stored !== $target || ! $disk->exists($target)) {
                $this->record($image, $target, 'errors', 'error: la subida no se confirmó');

                return;
            }

            $this->updatePath($image, $target);
        }

        $this->record($image, $target, 'uploaded', $dryRun ? 'se subiría' : 'subida');
    }

    private function localSource(string $path): ?string
    {
        $root = rtrim((string) config('portfolio.local_media_root'), '/');
        $relative = ltrim($path, '/');

        $candidates = [$root.'/'.$relative];

        if (! str_starts_with($path, '/')) {
            $candidates[] = Storage::disk('public')->path($relative);
        }

        foreach ($candidates as $candidate) {
            if (is_file($candidate)) {
                return $candidate;
            }
        }

        return null;
    }

    private function updatePath(ProjectImage $image, string $target): void
    {
        ProjectImage::query()->whereKey($image->id)->update(['path' => $target]);
    }

    /**
     * @param  'uploaded'|'skipped'|'missing'|'errors'  $bucket
     */
    private function record(ProjectImage $image, string $target, string $bucket, string $result): void
    {
        $this->summary[$bucket]++;
        $this->rows[] = [(string) $image->id, $image->project->slug, $image->path, $target, $result];
    }
}
