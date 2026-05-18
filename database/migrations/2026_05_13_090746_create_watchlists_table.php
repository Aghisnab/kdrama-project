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
        Schema::create('watchlists', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->uuid('kdrama_id');
            $table->foreign('kdrama_id')->references('kdrama_id')->on('kdramas')->cascadeOnDelete();
            $table->enum('status', ['plan_to_watch', 'watching', 'completed'])->default('plan_to_watch');
            $table->timestamps();
            $table->unique(['user_id', 'kdrama_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('watchlists');
    }
};
