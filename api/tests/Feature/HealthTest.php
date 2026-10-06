<?php

namespace Tests\Feature;

use Tests\TestCase;

class HealthTest extends TestCase
{
    public function test_health_endpoint_returns_ok_for_the_frontend_origin(): void
    {
        $response = $this->withHeaders([
            'Origin' => 'http://localhost:5173',
        ])->getJson('/api/health');

        $response->assertOk();
        $response->assertExactJson([
            'status' => 'ok',
        ]);
        $response->assertHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    }
}
