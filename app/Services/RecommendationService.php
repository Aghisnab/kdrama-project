<?php
// app/Services/RecommendationService.php

namespace App\Services;

use App\Models\Kdrama;
use App\Models\Watchlist;
use App\Config\moods;
use App\Services\MoodService;

class RecommendationService
{
    private array $allGenres = [
        'Romansa', 'Drama', 'Komedi', 'Laga', 'Misteri', 'Horor', 'Fantasi', 'Sejarah',
        'Thriller', 'Kehidupan', 'Remaja', 'Keluarga', 'Supernatural', 'Kriminal',
        'Medis', 'Hukum', 'Fiksi Ilmiah', 'Musik', 'Olahraga', 'BL', 'LGBTQ+',
        'Coming-of-age', 'Office', 'Psychological', 'Time Travel', 'Melodrama',
        'Political', 'Balas Dendam', 'Adaptasi', 'Friendship', 'Teknologi', 'Petualangan',
        'Zombie', 'Reinkarnasi', 'Spionase', 'Culinary', 'Detektif',
        'School Life', 'Military', 'Fantasy Historis', 'Chaebol', 'Webtoon',
    ];

    private array $moodGenreWeights;

    public function __construct()
    {
        $this->moodGenreWeights = config('moods', []); 
    }

    public function getMoods(): array
    {
        return array_keys($this->moodGenreWeights);
    }

    public function getRecommendations(string $mood, int $userId, int $limit = 12): array
    {
        if (!isset($this->moodGenreWeights[$mood])) return [];

        $moodWeights = $this->moodGenreWeights[$mood];

        // Drama yang sudah ditonton — exclude dari rekomendasi
        $watchedIds = Watchlist::where('user_id', $userId)
            ->pluck('kdrama_id')
            ->toArray();

        $dramas = Kdrama::whereNotIn('kdrama_id', $watchedIds)->get();

        $moodVector = $this->buildMoodVector($moodWeights);
        $userVector = $this->buildUserVector($userId);
        $hasHistory = !empty(array_filter($userVector));

        $maxPopularity = $dramas->max('popularity') ?: 1;

        $scored = $dramas->map(function ($drama) use ($moodVector, $userVector, $hasHistory, $maxPopularity) {
            $dramaVector = $this->buildDramaVector($drama);

            $moodScore       = $this->cosineSimilarity($moodVector, $dramaVector);
            $personalScore   = $hasHistory ? $this->cosineSimilarity($userVector, $dramaVector) : 0;
            $popularityScore = $drama->popularity / $maxPopularity;

            // Bobot: 60% mood, 30% personal, 10% popularity
            $finalScore = ($moodScore * 0.6) + ($personalScore * 0.3) + ($popularityScore * 0.1);

            return [
                'drama' => $drama,
                'score' => round($finalScore, 4),
            ];
        });

        return $scored
            ->sortByDesc('score')
            ->take($limit)
            ->values()
            ->map(fn($item) => $item['drama'])
            ->toArray();
    }

    private function buildMoodVector(array $moodWeights): array
    {
        return array_map(fn($genre) => $moodWeights[$genre] ?? 0.0, $this->allGenres);
    }

    private function buildDramaVector(Kdrama $drama): array
    {
        $genres = is_array($drama->genre)
            ? $drama->genre
            : json_decode($drama->genre, true) ?? [];

        return array_map(fn($genre) => in_array($genre, $genres) ? 1.0 : 0.0, $this->allGenres);
    }

    private function buildUserVector(int $userId): array
    {
        $watchlist = Watchlist::where('user_id', $userId)
            ->whereNotNull('rating')
            ->with('kdrama')
            ->get();

        $scores = array_fill_keys($this->allGenres, 0.0);
        $counts = array_fill_keys($this->allGenres, 0);

        foreach ($watchlist as $item) {
            if (!$item->kdrama) continue;

            $genres = is_array($item->kdrama->genre)
                ? $item->kdrama->genre
                : json_decode($item->kdrama->genre, true) ?? [];

            foreach ($genres as $genre) {
                if (array_key_exists($genre, $scores)) {
                    $scores[$genre] += $item->rating;
                    $counts[$genre]++;
                }
            }
        }

        return array_map(function ($genre) use ($scores, $counts) {
            return $counts[$genre] > 0
                ? ($scores[$genre] / $counts[$genre]) / 5.0
                : 0.0;
        }, $this->allGenres);
    }

    private function cosineSimilarity(array $a, array $b): float
    {
        $dot  = array_sum(array_map(fn($x, $y) => $x * $y, $a, $b));
        $magA = sqrt(array_sum(array_map(fn($x) => $x ** 2, $a)));
        $magB = sqrt(array_sum(array_map(fn($x) => $x ** 2, $b)));

        return ($magA && $magB) ? $dot / ($magA * $magB) : 0.0;
    }

    // app/Services/RecommendationService.php

    public function getByMood(string $mood, int $limit = 12): array
    {
        if (!isset($this->moodGenreWeights[$mood])) return [];

        $genres = array_keys(
            array_filter($this->moodGenreWeights[$mood], fn($w) => $w > 0)
        );

        return Kdrama::where(function ($query) use ($genres) {
                foreach ($genres as $genre) {
                    $query->orWhereJsonContains('genre', $genre);
                }
            })
            ->orderBy('popularity')
            ->limit($limit)
            ->get()
            ->toArray();
    }
}
