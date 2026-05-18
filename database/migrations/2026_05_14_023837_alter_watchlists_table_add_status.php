<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('watchlists', function (Blueprint $table) {

            // tambah status
            $table->enum('status', [
                'plan_to_watch',
                'watching',
                'completed'
            ])
            ->default('plan_to_watch')
            ->after('kdrama_id');

            // cegah duplicate
            $table->unique(['user_id', 'kdrama_id']);
        });
    }

    public function down(): void
    {
        Schema::table('watchlists', function (Blueprint $table) {

            $table->dropUnique(['user_id', 'kdrama_id']);

            $table->dropColumn('status');
        });
    }
};
