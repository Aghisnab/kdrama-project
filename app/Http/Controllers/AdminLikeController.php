<?php

namespace App\Http\Controllers;

use App\Models\Kdrama;
use App\Models\DramaLike;
use App\Models\Watchlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminLikeController extends Controller
{
    public function index(Request $request)
    {
        $query = Kdrama::query()
            ->withCount('likes')
            ->withCount(['watchlists as watch_count' => function ($q) {
                $q->whereIn('status', ['watching', 'completed']);
            }])
            ->whereHas('likes')  // ← ganti having() dengan whereHas()
            ->orderByDesc('likes_count');

        if ($request->search) {
            $query->where('kdrama_name', 'like', '%' . $request->search . '%');
        }
        if ($request->year) {
            $query->where('year', $request->year);
        }
        if ($request->genre) {
            $query->whereJsonContains('genre', $request->genre);
        }

        $dramas = $query->paginate(15)->withQueryString();

        return Inertia::render('Admin/Like/Index', [
            'dramas'  => $dramas,
            'filters' => $request->only(['search', 'year', 'genre']),
        ]);
    }
}
