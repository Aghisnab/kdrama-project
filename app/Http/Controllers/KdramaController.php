<?php

namespace App\Http\Controllers;

use App\Models\Kdrama;
use Carbon\Carbon;
use App\Models\DramaLike;
use App\Models\Watchlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class KdramaController extends Controller
{
    public function index(Request $request)
    {
        // Base query dengan filter search dan genre (tanpa mode)
        $baseQuery = Kdrama::query();

        if ($request->filled('search')) {
            $baseQuery->where('kdrama_name', 'ilike', '%' . $request->search . '%');
        }

        if ($request->filled('genre')) {
            $genres = (array) $request->genre;
            foreach ($genres as $genre) {
                $baseQuery->whereJsonContains('genre', $genre);
            }
        }

        // Hitung counts untuk masing-masing mode berdasarkan baseQuery yang sudah terfilter
        $today = Carbon::today();
        $currentYear = Carbon::now()->year;

        $totalAll = (clone $baseQuery)->count();
        $totalLatest = (clone $baseQuery)->whereYear('start_date', $currentYear)->count();
        $totalOngoing = (clone $baseQuery)->whereNotNull('start_date')
            ->where('start_date', '<=', $today)
            ->where(function ($q) use ($today) {
                $q->whereNull('end_date')->orWhere('end_date', '>=', $today);
            })->count();

        // Mode untuk paginasi data
        $mode = $request->get('mode', 'all');
        $dataQuery = clone $baseQuery;

        if ($mode === 'latest') {
            $dataQuery->whereYear('start_date', $currentYear)
                      ->orderBy('start_date', 'desc');
        } elseif ($mode === 'ongoing') {
            $dataQuery->whereNotNull('start_date')
                      ->where('start_date', '<=', $today)
                      ->where(function ($q) use ($today) {
                          $q->whereNull('end_date')->orWhere('end_date', '>=', $today);
                      })
                      ->orderBy('start_date', 'desc');
        } else {
            $dataQuery->orderBy('popularity', 'asc');
        }

        $dramas = $dataQuery->paginate(20)->withQueryString();

        // Daftar genre (statis)
        $genres = [
            'Romansa', 'Drama', 'Komedi', 'Laga', 'Misteri',
            'Horor', 'Fantasi', 'Sejarah', 'Thriller', 'Kehidupan',
            'Keluarga', 'Supernatural', 'Kriminal', 'Melodrama',
            'Balas Dendam', 'Psychological', 'Petualangan', 'School Life'
        ];

        return inertia('Kdrama/Index', [
            'dramas'  => $dramas,
            'filters' => [
                'search' => $request->search ?? '',
                'genre'  => (array) $request->genre,
                'mode'   => $mode,
            ],
            'genres'  => $genres,
            'counts'  => [
                'all'     => $totalAll,
                'latest'  => $totalLatest,
                'ongoing' => $totalOngoing,
            ],
        ]);
    }

    public function show($id)
    {
        $drama = Kdrama::where('kdrama_id', $id)->firstOrFail();

        $user = Auth::user();

        $isLiked = DramaLike::where('user_id', $user->id)
            ->where('kdrama_id', $id)
            ->exists();

        $watchlist = Watchlist::where('user_id', $user->id)
            ->where('kdrama_id', $id)
            ->first();

        return inertia('Kdrama/Form', [
            'drama'     => $drama,
            'isLiked'   => $isLiked,
            'watchlist' => $watchlist,
        ]);
    }
}
