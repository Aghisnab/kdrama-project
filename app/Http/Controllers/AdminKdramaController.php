<?php

namespace App\Http\Controllers;

use App\Models\Kdrama;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminKdramaController extends Controller
{
    public function index(Request $request)
    {
        $query = Kdrama::query();

        // Filter berdasarkan judul
        if ($request->filled('search')) {
            $query->where('kdrama_name', 'ilike', '%' . $request->search . '%');
        }

        // Filter berdasarkan tahun (exact match)
        if ($request->filled('year')) {
            $query->where('year', $request->year);
        }

        // Filter berdasarkan genre (mencari di dalam JSON array)
        if ($request->filled('genre')) {
            $query->whereJsonContains('genre', $request->genre);
        }

        $dramas = $query->orderBy('popularity', 'asc')->paginate(15)->withQueryString();

        return inertia('Admin/Kdrama/Index', [
            'dramas'  => $dramas,
            'filters' => $request->only('search'),
        ]);
    }

    public function create()
    {
        return inertia('Admin/Kdrama/Form');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'kdrama_name'      => 'required|string|max:255',
            'year'             => 'nullable|integer|min:1900|max:2100',
            'director'         => 'nullable|string|max:255',
            'screenwriter'     => 'nullable|string|max:255',
            'country'          => 'nullable|string|max:255',
            'genre'            => 'nullable|array',
            'total_episodes'   => 'nullable|integer',
            'duration'         => 'nullable|integer',
            'start_date'       => 'nullable|date',
            'end_date'         => 'nullable|date',
            'aired_on'         => 'nullable|string|max:255',
            'original_network' => 'nullable|string|max:255',
            'content_rating'   => 'nullable|string|max:255',
            'synopsis'         => 'nullable|string',
            'rank'             => 'nullable|integer',
            'popularity'       => 'nullable|integer',
            'poster_url'       => 'nullable|url|max:500',
        ]);

        Kdrama::create($validated);

        return redirect()->route('admin.kdrama.index')->with('success', 'Drama berhasil ditambahkan!');
    }

    public function edit(Kdrama $kdrama)
    {
        return inertia('Admin/Kdrama/Form', [
            'drama' => [
                ...$kdrama->toArray(),
                'start_date' => $kdrama->start_date
                    ? $kdrama->start_date->format('Y-m-d')
                    : null,

                'end_date' => $kdrama->end_date
                    ? $kdrama->end_date->format('Y-m-d')
                    : null,
            ]
        ]);
    }

    public function update(Request $request, Kdrama $kdrama)
    {
        $validated = $request->validate([
            'kdrama_name'      => 'required|string|max:255',
            'year'             => 'nullable|integer|min:1900|max:2100',
            'director'         => 'nullable|string|max:255',
            'screenwriter'     => 'nullable|string|max:255',
            'country'          => 'nullable|string|max:255',
            'genre'            => 'nullable|array',
            'total_episodes'   => 'nullable|integer',
            'duration'         => 'nullable|integer',
            'start_date'       => 'nullable|date',
            'end_date'         => 'nullable|date',
            'aired_on'         => 'nullable|string|max:255',
            'original_network' => 'nullable|string|max:255',
            'content_rating'   => 'nullable|string|max:255',
            'synopsis'         => 'nullable|string',
            'rank'             => 'nullable|integer',
            'popularity'       => 'nullable|integer',
            'poster_url'       => 'nullable|url|max:500',
        ]);

        $kdrama->update($validated);

        return redirect()->route('admin.kdrama.index')->with('success', 'Drama berhasil diupdate!');
    }

    public function destroy(Kdrama $kdrama)
    {
        $kdrama->delete();
        return redirect()->route('admin.kdrama.index')->with('success', 'Drama berhasil dihapus!');
    }
}
