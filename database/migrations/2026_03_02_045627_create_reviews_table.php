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
        Schema::create('reviews', function (Blueprint $table) {

            $table->uuid('review_id')->primary();

            $table->uuid('kdrama_id');

            $table->integer('story_score')->nullable();
            $table->integer('acting_cast_score')->nullable();
            $table->integer('music_score')->nullable();
            $table->integer('rewatch_value_score')->nullable();
            $table->float('overall_score')->nullable();
            $table->integer('episode_watched')->nullable();
            $table->integer('number_helpful')->default(0);

            $table->timestamps();

            $table->foreign('kdrama_id')
                ->references('kdrama_id')
                ->on('kdramas')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
