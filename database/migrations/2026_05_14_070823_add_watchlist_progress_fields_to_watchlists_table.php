<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('watchlists', function (Blueprint $table) {
            if (!Schema::hasColumn('watchlists', 'current_episode')) {
                $table->unsignedSmallInteger('current_episode')->nullable()->after('status');
            }
            if (!Schema::hasColumn('watchlists', 'rating')) {
                $table->decimal('rating', 3, 1)->nullable()->after('current_episode');
            }
            if (!Schema::hasColumn('watchlists', 'notes')) {
                $table->text('notes')->nullable()->after('rating');
            }
        });
    }

    public function down(): void
    {
        Schema::table('watchlists', function (Blueprint $table) {
            $table->dropColumn(['current_episode', 'rating', 'notes']);
        });
    }
};
