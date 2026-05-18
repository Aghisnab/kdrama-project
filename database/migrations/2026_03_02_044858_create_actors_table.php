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
        Schema::create('actors', function (Blueprint $table) {

            $table->uuid('actor_id')->primary();
            $table->uuid('kdrama_id');

            $table->string('actor_name');
            $table->string('character_name')->nullable();

            $table->enum('role', ['Main Role', 'Support Role', 'Guest Role', 'Guest', 'Bit Part', 'Unknown'])
                ->nullable();

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
        Schema::dropIfExists('actors');
    }
};
