<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('certifications', function (Blueprint $table) {
            $table->string('hours')->nullable()->after('issued_at');
        });

        Schema::create('site_content', function (Blueprint $table) {
            $table->unsignedTinyInteger('id')->primary();
            $table->string('hero_eyebrow')->nullable();
            $table->text('hero_body')->nullable();
            $table->text('hero_body_secondary')->nullable();
            $table->string('about_title')->nullable();
            $table->text('about_description')->nullable();
            $table->json('about_paragraphs')->nullable();
            $table->text('work_description')->nullable();
            $table->text('contact_description')->nullable();
            $table->json('experience')->nullable();
            $table->json('education')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('site_content');

        Schema::table('certifications', function (Blueprint $table) {
            $table->dropColumn('hours');
        });
    }
};
