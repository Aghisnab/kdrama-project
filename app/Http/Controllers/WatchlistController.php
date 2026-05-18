<?php

namespace App\Http\Controllers;

use App\Models\Watchlist;
use App\Models\UserActivity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WatchlistController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'kdrama_id'       => 'required|exists:kdramas,kdrama_id',
            'status'          => 'required|in:plan_to_watch,watching,completed',
            'current_episode' => 'nullable|integer|min:0',
            'rating'          => 'nullable|numeric|min:1|max:10',
            'notes'           => 'nullable|string|max:500',
        ]);

        $user = Auth::user();

        $watchlist = Watchlist::updateOrCreate(
            [
                'user_id'   => $user->id,
                'kdrama_id' => $request->kdrama_id,
            ],
            [
                'status'          => $request->status,
                'current_episode' => $request->current_episode,
                'rating'          => $request->rating,
                'notes'           => $request->notes,
            ]
        );

        UserActivity::create([
            'user_id'     => $user->id,
            'kdrama_id'   => $request->kdrama_id,
            'type'        => 'watchlist',
            'description' => match ($request->status) {
                'plan_to_watch' => 'Menambahkan drama ke Plan to Watch',
                'watching'      => 'Mulai menonton drama',
                'completed'     => 'Selesai menonton drama',
            },
        ]);

        return back()->with([
            'success' => true,
            'status'  => $watchlist->status,
        ]);
    }

    public function update(Request $request, Watchlist $watchlist)
    {
        // pastikan hanya pemilik yang bisa update
        if ($watchlist->user_id !== Auth::id()) {
            abort(403);
        }

        $request->validate([
            'status'          => 'sometimes|in:plan_to_watch,watching,completed',
            'current_episode' => 'nullable|integer|min:0',
            'rating'          => 'nullable|numeric|min:1|max:10',
            'notes'           => 'nullable|string|max:500',
        ]);

        $watchlist->update(
            $request->only(['status', 'current_episode', 'rating', 'notes'])
        );

        return back()->with(['success' => true]);
    }

    public function destroy(Request $request)
    {
        $request->validate([
            'kdrama_id' => 'required|exists:kdramas,kdrama_id',
        ]);

        Watchlist::where('user_id', Auth::id())
            ->where('kdrama_id', $request->kdrama_id)
            ->delete();

        return back()->with(['success' => true]);
    }

    public function index()
    {
        $watchlist = Watchlist::where('user_id', Auth::id())
            ->with(['kdrama:kdrama_id,kdrama_name,poster_url,year,genre,total_episodes,end_date,start_date,popularity'])
            ->latest()
            ->paginate(12);

        return inertia('Watchlist/Index', [
            'watchlist' => $watchlist,
        ]);
    }
}
