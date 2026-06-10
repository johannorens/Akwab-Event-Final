<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTypeTicketRequest;
use App\Http\Requests\UpdateTypeTicketRequest;
use App\Http\Resources\TypeTicketResource;
use App\Models\Type_ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class TypeTicketController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        $typeTickets = Cache::remember("types_tickets.tous", 3600, function () {
            return Type_ticket::all();
        });
        return TypeTicketResource::collection($typeTickets)->response()->getData(true);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTypeTicketRequest $request)
    {
        $typeTicket = Type_ticket::create($request->validated());

        $this->invalidateListeCache();

        return response()->json([
            'success' => true,
            'message' => 'Type ticket créé avec succès.',
            'type_ticket'  => new TypeTicketResource($typeTicket),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $typeTicket = Type_ticket::find($id);

        if (!$typeTicket) {
            return response()->json([
                'success' => false,
                'message' => 'Type de ticket non trouvé',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => new TypeTicketResource($typeTicket),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTypeTicketRequest $request, string $id)
    {
        $typeTicket = Type_ticket::find($id);

        if (!$typeTicket) {
            return response()->json([
                'success' => false,
                'message' => 'Type de ticket non trouvé',
            ], 404);
        }

        $typeTicket->update($request->validated());

        Cache::forget("typeTicket.{$id}");
        $this->invalidateListeCache();


        return response()->json([
            'success' => true,
            'message' => 'Type de ticket mis à jour avec succès',
            'data'    => new TypeTicketResource($typeTicket),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $typeTicket = Type_ticket::find($id);

        if ($typeTicket->tickets()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de supprimer ce type — des tickets existent déjà.',
            ], 422);
        }

        $typeTicket->delete();

        Cache::forget("typeTicket.{$id}");
        $this->invalidateListeCache();


        return response()->json([
            'success' => true,
            'message' => 'Type de ticket supprimé avec succès',
        ]);
    }

    private function invalidateListeCache(): void
    {
        DB::table('cache')
            ->where('key', 'LIKE', '%types_tickets.tous.page%')
            ->delete();
    }
}
