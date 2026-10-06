<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\CertificationRequest;
use App\Http\Resources\AdminCertificationResource;
use App\Models\Certification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class CertificationController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $this->authorize('viewAny', Certification::class);

        return AdminCertificationResource::collection(
            Certification::query()->ordered()->get(),
        );
    }

    public function store(CertificationRequest $request): JsonResponse
    {
        $this->authorize('create', Certification::class);

        $certification = Certification::query()->create($request->validated());

        return AdminCertificationResource::make($certification)
            ->response()
            ->setStatusCode(201);
    }

    public function update(CertificationRequest $request, Certification $certification): AdminCertificationResource
    {
        $this->authorize('update', $certification);

        $certification->update($request->validated());

        return new AdminCertificationResource($certification);
    }

    public function destroy(Certification $certification): Response
    {
        $this->authorize('delete', $certification);

        $certification->delete();

        return response()->noContent();
    }
}
