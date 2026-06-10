<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEvenementRequest;
use App\Http\Requests\UpdateEvenementRequest;
use App\Http\Resources\EvenementResource;
use App\Models\Evenement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;

class EvenementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $page = $request->input('page', 1);
        $evenements = Cache::remember("evenements.tous.page.{$page}", 3600, function () {
            return Evenement::with(['categories', 'lieux', 'organisateurs', 'types_tickets'])
                ->withCount('utilisateursAiment')
                ->orderBy('created_at', 'desc')
                ->paginate(10);
        });
        return EvenementResource::collection($evenements)->response()->getData(true);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEvenementRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $manager = new ImageManager(new Driver());
            $image = $manager->read($request->file('image'));
            $image->scale(width: 1280);
            $filename = uniqid() . '.webp';
            $path = 'evenements/' . $filename;
            $webp = $image->toWebp(quality: 80)->toString();
            Storage::disk('public')->put($path, $webp);
            $data['image'] = $path;
        }

        return DB::transaction(function () use ($data, $request) {

            $evenement = Evenement::create($data);
            $totalEvenement = array_sum(
                array_column($request->types_tickets, 'quantite_type_ticket')
            );
            // dd($request->types_tickets);
            foreach ($request->types_tickets as $type) {
                //  dd($type);
                $evenement->types_tickets()->attach($type['id_type_ticket'], [
                    'total_ticket_evenement'   => $totalEvenement,
                    'quantite_ticket_restante' => $type['quantite_type_ticket'],
                    'quantite_type_ticket'     => $type['quantite_type_ticket'],
                ]);
            }

            $this->invalidateListeCache();

            return response()->json([
                'success' => true,
                'evenement' => new EvenementResource($evenement),
                'message' => 'Événement créé avec succès'
            ], 201);
        });
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $evenement = Cache::remember("evenement.{$id}", 3600, function () use ($id) {
            return Evenement::with(['categories', 'lieux', 'organisateurs', 'types_tickets'])
                ->withCount('utilisateursAiment')
                ->findOrFail($id);
        });

        return new EvenementResource($evenement);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEvenementRequest $request, string $id)
    {
        $evenement = Evenement::findOrFail($id);

        $data = $request->validated();

        if ($request->hasFile('image')) {
            if ($evenement->image) {
                Storage::disk('public')->delete($evenement->image);
            }
            $manager = new ImageManager(new Driver());
            $image = $manager->read($request->file('image'));
            $image->scale(width: 1280);
            $filename = uniqid() . '.webp';
            $path = 'evenements/' . $filename;
            $webp = $image->toWebp(quality: 80)->toString();
            Storage::disk('public')->put($path, $webp);
            $data['image'] = $path;
        }

        return DB::transaction(function () use ($data, $request, $evenement, $id) {
            $evenement->update($data);
            $evenement->types_tickets()->detach();

            if ($request->has('types_tickets')) {
                $totalEvenement = array_sum(
                    array_column($request->types_tickets, 'quantite_type_ticket')
                );
                foreach ($request->types_tickets as $type) {
                    $evenement->types_tickets()->attach($type['id_type_ticket'], [
                        'total_ticket_evenement'   => $totalEvenement,
                        'quantite_ticket_restante' => $type['quantite_type_ticket'],
                        'quantite_type_ticket'     => $type['quantite_type_ticket'],
                    ]);
                }
            }


            Cache::forget("evenement.{$id}");
            $this->invalidateListeCache();

            return response()->json([
                'success' => true,
                'evenement' => new EvenementResource($evenement->fresh()),
                'message' => 'Événement mis à jour avec succès'
            ], 200);
        });
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $evenement = Evenement::findOrFail($id);

        if ($evenement->image) {
            Storage::disk('public')->delete($evenement->image);
        }

        $evenement->delete();

        Cache::forget("evenement.{$id}");
        $this->invalidateListeCache();

        return response()->json([
            'success' => true,
            'message' => 'Événement supprimé avec succès'
        ]);
    }

    private function invalidateListeCache(): void
    {
        DB::table('cache')
            ->where('key', 'LIKE', '%evenements.tous.page%')
            ->delete();
    }
}
