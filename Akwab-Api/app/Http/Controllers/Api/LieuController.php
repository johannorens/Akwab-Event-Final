<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\StoreLieuRequest;
use App\Http\Requests\UpdateLieuRequest;
use App\Http\Resources\LieuResource;
use App\Models\Lieu;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class LieuController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $page = $request->input('page', 1);
        $search = $request->input('search', '');
        $perPage = 10;

        $cacheKey = "lieux.page.{$page}.search." . md5($search);

        $lieux = Cache::remember($cacheKey, 3600, function () use ($search, $perPage) {
            $query = Lieu::query();

            if (!empty($search)) {
                $query->where(function ($q) use ($search) {
                    $q->where('nom', 'like', '%' . $search . '%')
                        ->orWhere('ville', 'like', '%' . $search . '%')
                        ->orWhere('adresse', 'like', '%' . $search . '%');
                });
            }

            return $query->orderBy('nom')->paginate($perPage);
        });

        return response()->json([
            'success' => true,
            'data'    => LieuResource::collection($lieux),
            'meta'    => [
                'current_page' => $lieux->currentPage(),
                'last_page'    => $lieux->lastPage(),
                'total'        => $lieux->total(),
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLieuRequest $request)
    {
        $lieu = Lieu::create($request->validated());
        $this->invalidateListeCache();

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
        $lieu = Cache::remember("lieu.{$id}", 3600, function () use ($id) {
            return Lieu::find($id);
        });

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

        Cache::forget("lieu.{$id}");
        $this->invalidateListeCache();

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
        Cache::forget("lieu.{$id}");
        $this->invalidateListeCache();

        return response()->json([
            'success' => true,
            'message' => 'Lieu supprimé avec succès',
        ]);
    }

    private function invalidateListeCache(): void
    {
        DB::table('cache')
            ->where('key', 'LIKE', '%lieux.page.%')
            ->delete();
    }
}
