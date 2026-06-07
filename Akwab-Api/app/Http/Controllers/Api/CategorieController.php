<?php

namespace App\Http\Controllers\Api;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCategorieRequest;
use App\Http\Requests\UpdateCategorieRequest;
use App\Http\Resources\CategorieResource;
use App\Models\Categorie;

class CategorieController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = Categorie::all();

        return response()->json([
            'success' => true,
            'data'    => CategorieResource::collection($categories),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCategorieRequest $request)
    {
        $categorie = Categorie::create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Catégorie créée avec succès',
            'data'    => new CategorieResource($categorie),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $categorie = Categorie::find($id);

        if (!$categorie) {
            return response()->json([
                'success' => false,
                'message' => 'Catégorie non trouvée',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => new CategorieResource($categorie),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCategorieRequest $request, $id)
    {
        $categorie = Categorie::find($id);

        if (!$categorie) {
            return response()->json([
                'success' => false,
                'message' => 'Catégorie non trouvée',
            ], 404);
        }

        $categorie->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Catégorie mise à jour avec succès',
            'data'    => new CategorieResource($categorie),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $categorie = Categorie::find($id);

        if (!$categorie) {
            return response()->json([
                'success' => false,
                'message' => 'Catégorie non trouvée',
            ], 404);
        }

        $categorie->delete();

        return response()->json([
            'success' => true,
            'message' => 'Catégorie supprimée avec succès',
        ]);
    }
}
