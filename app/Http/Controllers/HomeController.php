<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Controller\KdramaController;
use App\Models\Kdrama;

class HomeController extends Controller
{
    public function index()
    {
        $dramas = Kdrama::orderBy('popularity')->limit(8)->get();

        return inertia('Home', [
            'dramas' => $dramas,
        ]);
    }

    public function byMood(Request $request)
    {
        $mood = $request->get('mood', '');

        $moodGenres = [
            'Healing' => [
                'Kehidupan',
                'Keluarga',
                'Friendship',
                'Culinary',
                'Medis',
                'Coming-of-age'
            ],

            'Mau Nangis' => [
                'Melodrama',
                'Drama',
                'Keluarga',
                'Romansa'
            ],

            'Butuh Tawa' => [
                'Komedi',
                'Romansa',
                'Office',
                'School Life',
                'Friendship'
            ],

            'Pengen Romance' => [
                'Romansa',
                'Melodrama',
                'Fantasi',
                'Chaebol',
                'Time Travel',
                'Reinkarnasi'
            ],

            'Suka Thriller' => [
                'Thriller',
                'Misteri',
                'Kriminal',
                'Psychological',
                'Detektif',
                'Spionase'
            ],
        ];

        $genres = $moodGenres[$mood] ?? [];

        if (empty($genres)) {
            return response()->json([]);
        }

        $dramas = Kdrama::where(function ($query) use ($genres) {
                foreach ($genres as $genre) {
                    $query->orWhereJsonContains('genre', $genre);
                }
            })
            ->orderBy('start_date', 'desc')
            ->limit(5)
            ->get();

        return response()->json($dramas);
    }
}
