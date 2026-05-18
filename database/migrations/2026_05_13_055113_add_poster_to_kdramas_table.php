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
        Schema::table('kdramas', function (Blueprint $table) {
            $table->string('poster_url')->nullable()->after('synopsis');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('kdramas', function (Blueprint $table) {
            $table->dropColumn('poster_url');
        });
    }
};
