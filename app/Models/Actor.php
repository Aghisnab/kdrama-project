<?php
// app/Models/Actor.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Actor extends Model
{
    use HasUuids;

    protected $primaryKey = 'actor_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'actor_id', 'kdrama_id', 'actor_name', 'character_name', 'role','photo_url',
        'popularity',
    ];

    // Tambahkan relasi ini
    public function kdrama()
    {
        return $this->belongsTo(Kdrama::class, 'kdrama_id', 'kdrama_id');
    }
}
