<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class UserActivity extends Model
{
    use HasUuids;

    protected $fillable = ['user_id', 'kdrama_id', 'type', 'description'];

    public function kdrama()
    {
        return $this->belongsTo(Kdrama::class, 'kdrama_id', 'kdrama_id');
    }
}
