<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Watchlist extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'kdrama_id',
        'status',
        'current_episode',
        'rating',
        'notes',
    ];

    public $incrementing = false;
    protected $keyType = 'string';

    public function kdrama()
    {
        return $this->belongsTo(Kdrama::class, 'kdrama_id', 'kdrama_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
