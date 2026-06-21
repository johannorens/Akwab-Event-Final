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
use App\Models\Ticket;
use App\Models\EvenementTypeTicket;
use App\Models\Type_ticket;
use Illuminate\Support\Facades\Log;

class EvenementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $page = $request->input('page', 1);
        $search = $request->input('search', '');
        $perPage = 10;
        $cacheKey = "evenements.page.{$page}.search." . md5($search);

        $evenements = Cache::remember($cacheKey, 3600, function () use ($search, $perPage) {
            $query = Evenement::with(['categories', 'lieux', 'organisateurs', 'types_tickets'])
                ->withCount('utilisateursAiment')
                ->orderBy('created_at', 'desc');

            if (!empty($search)) {
                $query->where('nom', 'like', '%' . $search . '%');
            }

            return $query->paginate($perPage);
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

        return DB::transaction(function () use ($data) {
            $evenement = Evenement::create([
                'nom'             => $data['nom'],
                'date'            => $data['date'],
                'description'     => $data['description'],
                'image'           => $data['image'] ?? null,
                'id_categorie'    => $data['id_categorie'],
                'id_lieu'         => $data['id_lieu'],
                'id_organisateur' => $data['id_organisateur'],
            ]);

            $totalTickets = collect($data['tickets'])->sum('quantite_type_ticket');

            foreach ($data['tickets'] as $ticket) {
                $typeTicket = Type_ticket::create([
                    'libelle'     => $ticket['libelle'],
                    'prix_ticket' => $ticket['prix_ticket'],
                ]);

                $evenement->types_tickets()->attach($typeTicket->id_type_ticket, [
                    'total_ticket_evenement'   => $ticket['quantite_type_ticket'],
                    'quantite_type_ticket'     => $ticket['quantite_type_ticket'],
                    'quantite_ticket_restante' => $ticket['quantite_type_ticket'],
                ]);
            }

            $this->invalidateListeCache();

            return response()->json([
                'success'   => true,
                'evenement' => new EvenementResource($evenement->load('types_tickets')),
                'message'   => 'Événement créé avec succès'
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

        $gains = Ticket::where('id_evenement', $id)->sum('prix_total');

        return (new EvenementResource($evenement))
            ->additional(['gains_total' => $gains]);
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEvenementRequest $request, string $id)
    {
        Log::info('DEBUG UPDATE', $request->all());
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
            $evenement->update(collect($data)->except('tickets')->toArray());

            if (!empty($data['tickets'])) {
                $totalTickets = collect($data['tickets'])->sum('quantite_type_ticket');
                $idsEnvoyes = [];

                foreach ($data['tickets'] as $ticket) {
                    if (!empty($ticket['id_type_ticket'])) {
                        // Ticket existant → update
                        $typeTicket = Type_ticket::findOrFail($ticket['id_type_ticket']);
                        $typeTicket->update([
                            'libelle'     => $ticket['libelle'],
                            'prix_ticket' => $ticket['prix_ticket'],
                        ]);

                        $evenement->types_tickets()->updateExistingPivot($ticket['id_type_ticket'], [
                            'total_ticket_evenement'   => $ticket['quantite_type_ticket'],
                            'quantite_type_ticket'     => $ticket['quantite_type_ticket'],
                            'quantite_ticket_restante' => $ticket['quantite_type_ticket'],
                        ]);

                        $idsEnvoyes[] = $ticket['id_type_ticket'];
                    } else {
                        // Nouveau ticket → create + attach
                        $typeTicket = Type_ticket::create([
                            'libelle'     => $ticket['libelle'],
                            'prix_ticket' => $ticket['prix_ticket'],
                        ]);

                        $evenement->types_tickets()->attach($typeTicket->id_type_ticket, [
                            'total_ticket_evenement'   => $ticket['quantite_type_ticket'],
                            'quantite_type_ticket'     => $ticket['quantite_type_ticket'],
                            'quantite_ticket_restante' => $ticket['quantite_type_ticket'],
                        ]);

                        $idsEnvoyes[] = $typeTicket->id_type_ticket;
                    }
                }

                $evenement->types_tickets()
                    ->wherePivotNotIn('id_type_ticket', $idsEnvoyes)
                    ->detach();
            }

            Cache::forget("evenement.{$id}");
            $this->invalidateListeCache();

            return response()->json([
                'success'   => true,
                'evenement' => new EvenementResource($evenement->fresh(['types_tickets'])),
                'message'   => 'Événement mis à jour avec succès'
            ]);
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
