<?php

namespace App\Http\Controllers;

use App\Models\Kdrama;
use App\Models\Watchlist;
use App\Models\DramaLike; // Change this from Favorite to DramaLike
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Services\RecommendationService;

class DashboardUserController extends Controller
{
    public function __construct(private RecommendationService $recommendation) {}

    public function index()
    {
        $user = Auth::user();

        $watchlist = Watchlist::where('user_id', $user->id)
            ->with(['kdrama:kdrama_id,kdrama_name,poster_url,end_date,genre'])
            ->latest()
            ->take(6)
            ->get();

        // Total collection count
        $collectionCount = Watchlist::where('user_id', $user->id)
            ->whereIn('status', ['plan_to_watch', 'watching'])
            ->count();

        $latestDramas = Kdrama::orderBy('start_date', 'desc')
            ->take(6)
            ->get(['kdrama_id', 'kdrama_name', 'poster_url', 'year', 'start_date', 'end_date', 'genre', 'popularity']);

        $genres = ['Romansa', 'Drama', 'Komedi', 'Laga', 'Misteri', 'Horor', 'Fantasi', 'Sejarah'];
        $dramasByGenre = [];
        foreach ($genres as $genre) {
            $dramasByGenre[$genre] = Kdrama::whereJsonContains('genre', $genre)
                ->orderBy('popularity', 'asc')
                ->take(4)
                ->get(['kdrama_id', 'kdrama_name', 'poster_url', 'year', 'end_date', 'genre', 'popularity']);
        }

        $activities = $user->activities()->with('kdrama:kdrama_id,kdrama_name')->take(4)->get();

        // Change this query to use DramaLike instead of Favorite
        $favorites = DramaLike::where('user_id', $user->id)
            ->with(['kdrama:kdrama_id,kdrama_name,poster_url,end_date,genre'])
            ->latest()
            ->take(6)
            ->get();

        // Ambil aktor unik berdasarkan nama, ordered by popularity
        $popularActors = \App\Models\Actor::select('actor_name', 'photo_url', 'popularity')
            ->orderBy('popularity', 'asc')
            ->get()
            ->groupBy('actor_name')
            ->map(fn($group) => (object)[
                'actor_name' => $group->first()->actor_name,
                'photo_url'  => $group->firstWhere('photo_url', '!=', null)?->photo_url,
                'popularity' => $group->min('popularity'),
            ])
            ->take(8)
            ->values();

        return inertia('DashboardUser', [
            'watchlist'     => $watchlist,
            'collectionCount' => $collectionCount,
            'latestDramas'  => $latestDramas,
            'activities'    => $activities,
            'favorites'     => $favorites,
            'user'          => $user,
            'popularActors' => $popularActors,
            'moods' => $this->recommendation->getMoods(),
        ]);

    }

    public function recommend(Request $request)
    {
        $request->validate(['mood' => 'required|string']);

        $results = $this->recommendation->getRecommendations(
            mood:   $request->mood,
            userId: Auth::id(),
            limit:  12,
        );

        return response()->json(['dramas' => $results]);
    }
}
