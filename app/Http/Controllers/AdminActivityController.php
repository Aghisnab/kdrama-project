<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\DramaLike;
use App\Models\Watchlist;
use Inertia\Inertia;

class AdminActivityController extends Controller
{
    public function index()
    {
        $users = User::query()
            ->withCount([
                'likes as total_likes',
                'watchlists as total_watched' => fn($q) => $q->whereIn('status', ['watching', 'completed']),
            ])
            ->orderByDesc('created_at')
            ->paginate(20)
            ->through(fn($user) => [
                'id'            => $user->id,
                'name'          => $user->name,
                'email'         => $user->email,
                'joined_at'     => $user->created_at->format('d M Y'),
                'total_likes'   => $user->total_likes,
                'total_watched' => $user->total_watched,
            ]);

        return Inertia::render('Admin/Activity/Index', [
            'users' => $users,
        ]);
    }

    public function show(User $user)
    {
        // Drama yang disukai
        $likes = DramaLike::where('user_id', $user->id)
            ->with('kdrama:kdrama_id,kdrama_name,poster_url,genre,year')
            ->latest()
            ->get()
            ->map(fn($like) => [
                'kdrama_id'   => $like->kdrama_id,
                'kdrama_name' => $like->kdrama->kdrama_name ?? '—',
                'poster_url'  => $like->kdrama->poster_url ?? null,
                'genre'       => $like->kdrama->genre ?? [],
                'year'        => $like->kdrama->year ?? null,
                'liked_at'    => $like->created_at->format('d M Y'),
            ]);

        // Drama yang ditonton (watching & completed) dengan rating
        $watchlist = Watchlist::where('user_id', $user->id)
            ->whereIn('status', ['watching', 'completed'])
            ->with('kdrama:kdrama_id,kdrama_name,poster_url,genre,year')
            ->latest()
            ->get()
            ->map(fn($w) => [
                'kdrama_id'   => $w->kdrama_id,
                'kdrama_name' => $w->kdrama->kdrama_name ?? '—',
                'poster_url'  => $w->kdrama->poster_url ?? null,
                'genre'       => $w->kdrama->genre ?? [],
                'year'        => $w->kdrama->year ?? null,
                'status'      => $w->status,
                'rating'      => $w->rating,
                'added_at'    => $w->created_at->format('d M Y'),
            ]);

        return Inertia::render('Admin/Activity/Show', [
            'user' => [
                'id'        => $user->id,
                'name'      => $user->name,
                'email'     => $user->email,
                'joined_at' => $user->created_at->format('d M Y'),
                'total_likes'   => $likes->count(),
                'total_watched' => $watchlist->count(),
            ],
            'likes'     => $likes,
            'watchlist' => $watchlist,
        ]);
    }
}
