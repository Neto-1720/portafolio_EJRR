<?php

use App\Http\Controllers\CertificationController;
use App\Http\Controllers\Demo\ConversationController as DemoConversationController;
use App\Http\Controllers\Demo\NotificationController as DemoNotificationController;
use App\Http\Controllers\Demo\ShipmentController as DemoShipmentController;
use App\Http\Controllers\HealthController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TechnologyController;
use Illuminate\Support\Facades\Route;

Route::get('/health', HealthController::class);
Route::get('/projects', [ProjectController::class, 'index']);
Route::get('/projects/{project:slug}', [ProjectController::class, 'show']);
Route::get('/technologies', [TechnologyController::class, 'index']);
Route::get('/certifications', [CertificationController::class, 'index']);

Route::prefix('demo')->group(function (): void {
    Route::get('/shipments', [DemoShipmentController::class, 'index']);
    Route::get('/notifications', [DemoNotificationController::class, 'index']);
    Route::post('/notifications/{notification}/simulate', [DemoNotificationController::class, 'simulate']);
    Route::get('/conversations', [DemoConversationController::class, 'index']);
    Route::get('/conversations/{conversation}', [DemoConversationController::class, 'show']);
    Route::patch('/conversations/{conversation}', [DemoConversationController::class, 'update']);
});
