<?php

namespace App\Http\Resources;

use App\Models\ProjectImage;
use App\Services\PortfolioStorage;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin ProjectImage */
class ProjectImageResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'path' => $this->path,
            'url' => app(PortfolioStorage::class)->url($this->path),
            'alt_text' => $this->alt_text,
            'caption' => $this->caption,
            'sort_order' => $this->sort_order,
            'is_cover' => $this->is_cover,
        ];
    }
}
