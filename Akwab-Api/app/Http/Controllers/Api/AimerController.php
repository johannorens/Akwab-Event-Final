<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Evenement;
use Illuminate\Http\Request;

class AimerController extends Controller
{

    public function index()
    {
        $evenements = Evenement::withCount('utilisateursAiment')->get();

        return response()->json([
            'success' => true,
            'data'    => $evenements,
        ]);
    }
    public function toggle(Request $request, $id)
    {
        $user = $request->user();
        $evenement = Evenement::find($id);

        if (!$evenement) {
            return response()->json([
                'success' => false,
                'message' => 'Événement non trouvé',
            ], 404);
        }

        $user->evenementsAimes()->toggle($id);

        $liked = $user->evenementsAimes()
            ->where('evenements.id_evenement', $id)
            ->exists();

        $count = $evenement->utilisateursAiment()->count();

        return response()->json([
            'success' => true,
            'liked'   => $liked,
            'count'   => $count,
        ]);
    }

    public function mesEvenementsAimes(Request $request)
    {
        $evenements = $request->user()->evenementsAimes()->get();

        return response()->json([
            'success' => true,
            'data'    => $evenements,
        ]);
    }
}
