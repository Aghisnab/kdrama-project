<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Kdrama;
use App\Models\User;
use App\Models\DramaLike;
use App\Models\Watchlist;
use App\Models\Favorite;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $totalDramas    = Kdrama::count();
        $totalUsers     = User::where('role', 'user')->count();
        $totalLikes     = DramaLike::count();
        $totalWatchlist = Watchlist::count();

        $latestDramas = Kdrama::orderBy('start_date', 'desc')
            ->take(7)
            ->get(['kdrama_id', 'kdrama_name', 'poster_url', 'year', 'start_date', 'end_date', 'popularity']);

        $mostLiked = DramaLike::selectRaw('kdrama_id, count(*) as like_count')
            ->groupBy('kdrama_id')
            ->orderByDesc('like_count')
            ->take(7)
            ->with('kdrama:kdrama_id,kdrama_name,poster_url,popularity')
            ->get();

        $mostWatchlisted = Watchlist::selectRaw('kdrama_id, count(*) as watchlist_count')
            ->groupBy('kdrama_id')
            ->orderByDesc('watchlist_count')
            ->take(7)
            ->with('kdrama:kdrama_id,kdrama_name,poster_url,popularity')
            ->get();

        return inertia('Admin/Dashboard', [
            'totalDramas'     => $totalDramas,
            'totalUsers'      => $totalUsers,
            'totalLikes'      => $totalLikes,
            'totalWatchlist'  => $totalWatchlist,
            'latestDramas'    => $latestDramas,
            'mostLiked'       => $mostLiked,
            'mostWatchlisted' => $mostWatchlisted,
        ]);
    }
}
