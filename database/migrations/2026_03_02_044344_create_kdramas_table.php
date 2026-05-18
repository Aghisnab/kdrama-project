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
        Schema::create('kdramas', function (Blueprint $table) {
            $table->uuid('kdrama_id')->primary();

            $table->string('kdrama_name');
            $table->year('year')->nullable();
            $table->string('director')->nullable();
            $table->string('screenwriter')->nullable();
            $table->string('country')->default('South Korea');
            $table->json('genre')->nullable();
            $table->integer('total_episodes')->nullable();
            $table->integer('duration')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->string('aired_on')->nullable();
            $table->string('original_network')->nullable();
            $table->string('content_rating')->nullable();
            $table->text('synopsis')->nullable();
            $table->integer('rank')->nullable();
            $table->integer('popularity')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kdramas');
    }
};
