<?php

use App\Http\Controllers\CertificationController;
use App\Http\Controllers\HealthController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TechnologyController;
use Illuminate\Support\Facades\Route;

Route::get('/health', HealthController::class);
Route::get('/projects', [ProjectController::class, 'index']);
Route::get('/projects/{project:slug}', [ProjectController::class, 'show']);
Route::get('/technologies', [TechnologyController::class, 'index']);
Route::get('/certifications', [CertificationController::class, 'index']);
