<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\UpdateUtilisateurRequest;
use App\Http\Resources\UtilisateurResource;
use App\Models\Utilisateur;

class UtilisateurController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $utilisateurs = Utilisateur::all();

        return response()->json([
            'success' => true,
            'data'    => UtilisateurResource::collection($utilisateurs),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $utilisateur = Utilisateur::find($id);

        if (!$utilisateur) {
            return response()->json([
                'success' => false,
                'message' => 'Utilisateur non trouvé',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => new UtilisateurResource($utilisateur),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUtilisateurRequest $request, $id)
    {
        $utilisateur = Utilisateur::find($id);

        if (!$utilisateur) {
            return response()->json([
                'success' => false,
                'message' => 'Utilisateur non trouvé',
            ], 404);
        }

        $utilisateur->update(
            $request->safe()->except('mot_de_passe_confirmation')
        );

        return response()->json([
            'success' => true,
            'message' => 'Utilisateur mis à jour avec succès',
            'data'    => new UtilisateurResource($utilisateur),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $utilisateur = Utilisateur::find($id);

        if (!$utilisateur) {
            return response()->json([
                'success' => false,
                'message' => 'Utilisateur non trouvé',
            ], 404);
        }

        $utilisateur->delete();

        return response()->json([
            'success' => true,
            'message' => 'Utilisateur supprimé avec succès',
        ]);
    }
    public function profile(Request $request)
    {
        return response()->json([
            'success' => true,
            'data'    => new UtilisateurResource($request->user()),
        ]);
    }

    public function updateProfile(UpdateUtilisateurRequest $request)
    {
        $utilisateur = $request->user();

        $utilisateur->update(
            $request->safe()->except('mot_de_passe_confirmation')
        );

        return response()->json([
            'success' => true,
            'message' => 'Profil mis à jour avec succès',
            'data'    => new UtilisateurResource($utilisateur),
        ]);
    }
}
