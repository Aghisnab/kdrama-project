<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use App\Models\Kdrama;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardUserController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\AdminKdramaController;
use App\Http\Controllers\AdminActorController;
use App\Http\Controllers\AdminActivityController;
use App\Http\Controllers\AdminLikeController;
use App\Http\Controllers\KdramaController;
use App\Http\Controllers\DramaLikeController;
use App\Http\Controllers\WatchlistController;
use App\Http\Controllers\ActorController;
use App\Http\Controllers\HomeController;

// ─── Debug ────────────────────────────────────────────────────────────────────
Route::get('/test-db', function () {
    try {
        DB::connection()->getPdo();
        return "Database connected";
    } catch (\Exception $e) {
        return "Database not connected: " . $e->getMessage();
    }
});

// ─── Public ───────────────────────────────────────────────────────────────────
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/api/mood', [HomeController::class, 'byMood']);
Route::get('/api/dramas', function () {
    return response()->json(
        Kdrama::orderBy('start_date', 'desc')
            ->take(25)
            ->get(['kdrama_id', 'kdrama_name', 'poster_url', 'year', 'popularity', 'end_date', 'synopsis'])
    );
});

// ─── Guest only ───────────────────────────────────────────────────────────────
Route::middleware('guest')->group(function () {
    Route::get('/login',    fn() => inertia('Auth/Login'))->name('login');
    Route::get('/register', fn() => inertia('Auth/Register'))->name('register');
    Route::post('/login',    [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
});

// ─── Auth ─────────────────────────────────────────────────────────────────────
Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    // User dashboard
    Route::get('/dashboard',           [DashboardUserController::class, 'index'])->name('dashboard');
    Route::post('/dashboard/recommend', [DashboardUserController::class, 'recommend'])->name('dashboard.recommend');

    // Dramas (user)
    Route::get('/dramas',      [KdramaController::class, 'index'])->name('dramas.index');
    Route::get('/dramas/{id}', [KdramaController::class, 'show'])->name('dramas.show');

    // Watchlist
    Route::get('/watchlist',              [WatchlistController::class, 'index'])->name('watchlist.index');
    Route::post('/watchlist',             [WatchlistController::class, 'store'])->name('watchlist.store');
    Route::patch('/watchlist/{watchlist}', [WatchlistController::class, 'update'])->name('watchlist.update');
    Route::delete('/watchlist',           [WatchlistController::class, 'destroy'])->name('watchlist.destroy');

    // Actors (user)
    Route::get('/actors',              [ActorController::class, 'index'])->name('actors.index');
    Route::get('/actors/{name}',       [ActorController::class, 'show'])->name('actors.show');
    Route::get('/api/actors/search',   [ActorController::class, 'search'])->name('actors.search');

    // Like
    Route::post('/dramas/like', [DramaLikeController::class, 'toggle'])->name('dramas.like');
});

// ─── Admin ────────────────────────────────────────────────────────────────────
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard',  [AdminDashboardController::class, 'index'])->name('dashboard');
    Route::get('/activities', [AdminActivityController::class, 'index'])->name('activities');
    Route::get('/activities/{user}', [AdminActivityController::class, 'show'])->name('activities.show');

    // Kdrama CRUD
    Route::resource('kdrama', AdminKdramaController::class)->except(['show']);

    // Likes & Favorites
    Route::get('/likes',     [AdminLikeController::class, 'index'])->name('likes');
    Route::get('/favorites', fn() => inertia('Admin/Favorites'))->name('favorites');

    // Actors — specific routes BEFORE wildcard {name}/{actor_id}
    Route::get('/actors/search-kdrama', [AdminActorController::class, 'searchKdrama'])->name('actors.search-kdrama');
    Route::get('/actors/search-actor',  [AdminActorController::class, 'searchActor'])->name('actors.search-actor');
    Route::get('/actors/create',        [AdminActorController::class, 'create'])->name('actors.create');
    Route::post('/actors',              [AdminActorController::class, 'store'])->name('actors.store');
    Route::get('/actors',               [AdminActorController::class, 'index'])->name('actors.index');
    Route::get('/actors/{actor_id}/edit',  [AdminActorController::class, 'edit'])->name('actors.edit');
    Route::put('/actors/{actor_id}',       [AdminActorController::class, 'update'])->name('actors.update');
    Route::delete('/actors/{actor_id}',    [AdminActorController::class, 'destroy'])->name('actors.destroy');
    Route::get('/actors/{name}',           [AdminActorController::class, 'show'])->name('actors.show');
});
