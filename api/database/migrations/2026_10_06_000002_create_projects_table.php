<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->string('subtitle')->nullable();
            $table->text('summary');
            $table->text('context')->nullable();
            $table->text('problem')->nullable();
            $table->text('solution')->nullable();
            $table->text('responsibilities')->nullable();
            $table->text('technical_decisions')->nullable();
            $table->text('challenges')->nullable();
            $table->text('results')->nullable();
            $table->text('learnings')->nullable();
            $table->string('role')->nullable();
            $table->string('period')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_published')->default(false);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
