<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Actor;
use Illuminate\Http\Request;

class ActorController extends Controller
{
    public function index(Request $request)
    {
        $actors = Actor::select('actor_name')
            ->selectRaw('COUNT(DISTINCT kdrama_id) as drama_count')
            ->selectRaw('MAX(popularity) as popularity')
            ->selectRaw('MIN(photo_url) as photo_url')
            ->groupBy('actor_name')
            ->when($request->search, function ($query, $search) {
                // Case-insensitive search (MySQL)
                $query->whereRaw('LOWER(actor_name) LIKE ?', ['%' . strtolower($search) . '%']);
                // Jika pakai PostgreSQL: $query->where('actor_name', 'ilike', "%{$search}%");
            })
            ->orderBy('popularity', 'asc')
            ->paginate(24)
            ->withQueryString();

        return Inertia::render('Actors/Index', [
            'actors'  => $actors,
            'filters' => $request->only('search'),
        ]);
    }

    // app/Http/Controllers/ActorController.php

    public function search(Request $request)
    {
        $q = $request->input('q');
        if (!$q) {
            return response()->json([]);
        }

        $actors = Actor::select('actor_name')
            ->where('actor_name', 'like', "%{$q}%")
            ->groupBy('actor_name')
            ->limit(10)
            ->get();

        return response()->json($actors);
    }

    public function show($name)
    {
        $name = urldecode($name);

        $entries = Actor::where('actor_name', $name)
            ->with('kdrama:kdrama_id,kdrama_name,poster_url,year,start_date,end_date,popularity')
            ->get();

        if ($entries->isEmpty()) abort(404);

        $actor = [
            'actor_name' => $entries->first()->actor_name,
            'photo_url'  => $entries->first()->photo_url,
            'popularity' => $entries->first()->popularity,
            'dramas'     => $entries->map(fn($e) => [
                'kdrama'         => $e->kdrama,
                'character_name' => $e->character_name,
                'role'           => $e->role,
            ]),
        ];

        return inertia('Actors/Show', ['actor' => $actor]);
    }
}
