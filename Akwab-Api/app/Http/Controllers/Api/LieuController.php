<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\StoreLieuRequest;
use App\Http\Requests\UpdateLieuRequest;
use App\Http\Resources\LieuResource;
use App\Models\Lieu;

class LieuController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $lieux = Lieu::all();

        return response()->json([
            'success' => true,
            'data'    => LieuResource::collection($lieux),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLieuRequest $request)
    {
        $lieu = Lieu::create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Lieu créé avec succès',
            'data'    => new LieuResource($lieu),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $lieu = Lieu::find($id);

        if (!$lieu) {
            return response()->json([
                'success' => false,
                'message' => 'Lieu non trouvé',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => new LieuResource($lieu),
        ]);
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLieuRequest $request, $id)
    {
        $lieu = Lieu::find($id);

        if (!$lieu) {
            return response()->json([
                'success' => false,
                'message' => 'Lieu non trouvé',
            ], 404);
        }

        $lieu->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Lieu mis à jour avec succès',
            'data'    => new LieuResource($lieu),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $lieu = Lieu::find($id);

        if (!$lieu) {
            return response()->json([
                'success' => false,
                'message' => 'Lieu non trouvé',
            ], 404);
        }

        $lieu->delete();

        return response()->json([
            'success' => true,
            'message' => 'Lieu supprimé avec succès',
        ]);
    }
}
