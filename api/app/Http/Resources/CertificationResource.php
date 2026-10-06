<?php

namespace App\Http\Resources;

use App\Models\Certification;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Certification */
class CertificationResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'issuer' => $this->issuer,
            'issued_at' => $this->issued_at?->toDateString(),
            'credential_url' => $this->credential_url,
            'image_path' => $this->image_path,
        ];
    }
}
