<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Kdrama extends Model
{
    use HasUuids;

    protected $table = 'kdramas';
    protected $primaryKey = 'kdrama_id';
    public $incrementing = false;
    public $timestamps = false;
    protected $keyType = 'string';

    protected $fillable = [
        'kdrama_name',
        'year',
        'director',
        'screenwriter',
        'country',
        'genre',
        'total_episodes',
        'duration',
        'start_date',
        'end_date',
        'aired_on',
        'original_network',
        'content_rating',
        'synopsis',
        'rank',
        'popularity',
        'poster_url',
    ];

    protected $casts = [
        'genre'      => 'array',
        'start_date' => 'date',
        'end_date'   => 'date',
        'year'       => 'integer',
        'total_episodes' => 'integer',
        'duration'   => 'integer',
        'rank'       => 'integer',
        'popularity' => 'integer',
    ];

    // Helper: drama masih on-going kalau end_date null
    public function getIsOngoingAttribute(): bool
    {
        return is_null($this->end_date);
    }

    public function actors()
    {
        return $this->belongsToMany(
            Actor::class,
            'actor_drama',
            'kdrama_id',
            'actor_id',
            'kdrama_id',
            'actor_id'
        )->withPivot('character_name', 'role')->withTimestamps();
    }

    public function likes()
    {
        return $this->hasMany(\App\Models\DramaLike::class, 'kdrama_id', 'kdrama_id');
    }

    public function watchlists()
    {
        return $this->hasMany(\App\Models\Watchlist::class, 'kdrama_id', 'kdrama_id');
    }
}
