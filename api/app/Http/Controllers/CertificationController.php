<?php

namespace App\Http\Controllers;

use App\Http\Resources\CertificationResource;
use App\Models\Certification;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CertificationController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $certifications = Certification::query()
            ->published()
            ->orderBy('sort_order')
            ->orderByRaw('issued_at is null')
            ->orderByDesc('issued_at')
            ->orderBy('id')
            ->get([
                'id',
                'name',
                'issuer',
                'issued_at',
                'credential_url',
                'image_path',
            ]);

        return CertificationResource::collection($certifications);
    }
}
