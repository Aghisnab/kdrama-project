<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Actor;
use App\Models\Kdrama;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminActorController extends Controller
{
    /**
     * Menampilkan daftar aktor (unique by actor_name) dengan jumlah drama.
     */
    public function index(Request $request)
    {
        $actors = Actor::select('actor_name')
            ->selectRaw('COUNT(DISTINCT kdrama_id) as drama_count')
            ->selectRaw('MAX(popularity) as popularity')
            ->selectRaw('MIN(photo_url) as photo_url')  // <-- tambah ini
            ->groupBy('actor_name')
            ->when($request->search, fn($q) =>
                $q->where('actor_name', 'ilike', "%{$request->search}%")
            )
            ->orderBy('popularity', 'asc')
            ->paginate(21)
            ->withQueryString();

        return inertia('Admin/Actors/Index', [
            'actors'  => $actors,
            'filters' => $request->only('search'),
        ]);
    }

    /**
     * Menampilkan detail seorang aktor (semua perannya di berbagai drama).
     * Mengembalikan struktur 'actor' yang sesuai dengan komponen ActorShow.
     */
    public function show($name)
    {
        $entries = Actor::where('actor_name', $name)
            ->with('kdrama:kdrama_id,kdrama_name,poster_url')
            ->get();

        if ($entries->isEmpty()) {
            abort(404, 'Aktor tidak ditemukan');
        }

        $firstEntry = $entries->first();

        $actorData = [
            'actor_name' => $name,
            'photo_url'  => $firstEntry->photo_url ?? null,
            'popularity' => $firstEntry->popularity ?? null,
            'dramas'     => $entries->map(function ($entry) {
                return [
                    'actor_id'       => $entry->actor_id, // untuk edit & hapus per entri
                    'character_name' => $entry->character_name,
                    'role'           => $entry->role,
                    'kdrama'         => $entry->kdrama ? [
                        'kdrama_id'   => $entry->kdrama->kdrama_id,
                        'kdrama_name' => $entry->kdrama->kdrama_name,
                        'poster_url'  => $entry->kdrama->poster_url,
                    ] : null,
                ];
            }),
        ];

        return inertia('Admin/Actors/Show', [
            'actor' => $actorData,
        ]);
    }

    /**
     * API endpoint untuk mencari drama berdasarkan judul (digunakan oleh SearchableSelect).
     */
    public function searchKdrama(Request $request)
    {
        $query = $request->get('q');
        if (empty($query)) {
            return response()->json([]);
        }

        $results = Kdrama::where('kdrama_name', 'ilike', "%{$query}%")
            ->limit(10)
            ->get(['kdrama_id', 'kdrama_name']);

        return response()->json($results);
    }

    //mencari actor
    public function searchActor(Request $request)
    {
        $q = $request->get('q');
        if (empty($q)) {
            return response()->json([]);
        }

        $actors = Actor::select('actor_name')
            ->where('actor_name', 'ilike', "%{$q}%")
            ->distinct()   // nama unik
            ->limit(10)
            ->get()
            ->pluck('actor_name') // return array of strings
            ->map(fn($name) => ['actor_name' => $name]);

        return response()->json($actors);
    }

    /**
     * Menampilkan form tambah peran aktor (create).
     */
    public function create()
    {
        // Tidak perlu mengirim daftar drama karena pakai searchable select
        return inertia('Admin/Actors/Create');
    }

    /**
     * Menyimpan data aktor baru (satu entri).
     */
    public function store(Request $request)
    {
    $validated = $request->validate([
        'actor_name'     => 'required|string|max:255',
        'kdrama_id'      => 'required|uuid|exists:kdramas,kdrama_id',
        'character_name' => 'nullable|string|max:255',
        'role'           => 'nullable|in:Main Role,Support Role,Guest Role,Guest,Bit Part,Unknown',
        'photo_url'      => 'nullable|url|max:255',      // tambah
        'popularity'     => 'nullable|integer',          // tambah
    ]);

        Actor::create([
            'actor_id'       => Str::uuid(),
            'actor_name'     => $validated['actor_name'],
            'kdrama_id'      => $validated['kdrama_id'],
            'character_name' => $validated['character_name'] ?? null,
            'role'           => $validated['role'] ?? 'Unknown',
            'photo_url'      => $validated['photo_url'] ?? null,
            'popularity'     => $validated['popularity'] ?? null,
        ]);

        return redirect()->route('admin.actors.index')
            ->with('success', 'Peran aktor berhasil ditambahkan.');
    }

    /**
     * Menampilkan form edit untuk satu entri (berdasarkan actor_id).
     */
    public function edit($actor_id)
    {
        $actor = Actor::where('actor_id', $actor_id)
            ->with('kdrama') // eager loading relasi kdrama
            ->firstOrFail();

        return inertia('Admin/Actors/Edit', [
            'actor' => $actor,
            'kdrama_name' => $actor->kdrama->kdrama_name ?? '', // tambahkan nama drama
        ]);
    }

    /**
     * Memperbarui satu entri actor (berdasarkan actor_id).
     */
    public function update(Request $request, $actor_id)
    {
        $actor = Actor::where('actor_id', $actor_id)->firstOrFail();

        $validated = $request->validate([
            'actor_name'     => 'required|string|max:255',
            'kdrama_id'      => 'required|uuid|exists:kdramas,kdrama_id',
            'character_name' => 'nullable|string|max:255',
            'role'           => 'nullable|in:Main Role,Support Role,Guest Role,Guest,Bit Part,Unknown',
            'photo_url'      => 'nullable|url|max:255',      // tambah
            'popularity'     => 'nullable|integer',
        ]);

        $actor->update($validated);

        // Redirect ke halaman show berdasarkan nama aktor (agar melihat semua perannya)
        return redirect()->route('admin.actors.show', $actor->actor_name)
            ->with('success', 'Data peran aktor berhasil diupdate.');
    }

    /**
     * Menghapus satu entri actor (berdasarkan actor_id).
     * Jika masih ada entri lain dengan nama yang sama, redirect ke halaman show,
     * jika tidak, redirect ke index.
     */
    public function destroy($actor_id)
    {
        $actor = Actor::where('actor_id', $actor_id)->firstOrFail();
        $name = $actor->actor_name;
        $actor->delete();

        $remaining = Actor::where('actor_name', $name)->count();

        return $remaining > 0
            ? redirect()->route('admin.actors.show', $name)->with('success', 'Entri dihapus.')
            : redirect()->route('admin.actors.index')->with('success', 'Aktor dihapus.');
    }
}
