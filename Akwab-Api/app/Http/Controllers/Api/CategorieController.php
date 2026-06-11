<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCategorieRequest;
use App\Http\Requests\UpdateCategorieRequest;
use App\Http\Resources\CategorieResource;
use App\Models\Categorie;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class CategorieController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = Cache::remember('categories.tous', 3600, function () {
            return Categorie::all();
        });

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

        $this->invalidateListeCache();


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

        $categorie = Cache::remember("categorie.{$id}", 3600, function () use ($id) {
            return Categorie::find($id);
        });

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

        Cache::forget("categorie.{$id}");
        $this->invalidateListeCache();


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


        Cache::forget("categorie.{$id}");
        $this->invalidateListeCache();

        return response()->json([
            'success' => true,
            'message' => 'Catégorie supprimée avec succès',
        ]);
    }

    private function invalidateListeCache(): void
    {
        DB::table('cache')
            ->where('key', 'LIKE', '%categories.tous%')
            ->delete();
    }
}
