<?php

namespace App\Http\Controllers;

use App\Models\DramaLike;
use App\Models\UserActivity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DramaLikeController extends Controller
{
    public function toggle(Request $request)
    {
        $request->validate([
            'kdrama_id' => 'required|exists:kdramas,kdrama_id',
        ]);

        $user = Auth::user();
        $existing = DramaLike::where('user_id', $user->id)
            ->where('kdrama_id', $request->kdrama_id)
            ->first();

        if ($existing) {
            $existing->delete();
            $liked = false;
        } else {
            DramaLike::create([
                'user_id'   => $user->id,
                'kdrama_id' => $request->kdrama_id,
            ]);

            UserActivity::create([
                'user_id'     => $user->id,
                'kdrama_id'   => $request->kdrama_id,
                'type'        => 'like',
                'description' => 'Menyukai sebuah drama',
            ]);

            $liked = true;
        }

        return back()->with(['liked' => $liked]);
    }
}
