<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\StoreTicketRequest;
use App\Http\Requests\UpdateTicketRequest;
use App\Http\Resources\TicketResource;
use App\Mail\TicketPaymentConfirmation;
use App\Models\Ticket;
use App\Models\Type_ticket;
use App\Models\Evenement;
use Illuminate\Support\Facades\Mail;


class TicketController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Ticket::with([
            'utilisateur',
            'typeTicket',
            'evenement'
        ]);

        if ($request->id_evenement) {
            $query->where('id_evenement', $request->id_evenement);
        }

        $gains_total = (clone $query)->sum('prix_total');
        $tickets = $query->paginate(10);

        return response()->json([
            'success'     => true,
            'data'        => TicketResource::collection($tickets),
            'gains_total' => (float) $gains_total,
            'meta'        => [
                'current_page' => $tickets->currentPage(),
                'last_page'    => $tickets->lastPage(),
                'total'        => $tickets->total(),
            ],
        ]);
    }

    public function mesTickets(Request $request)
    {
        $tickets = Ticket::with(['evenement.lieux', 'evenement.organisateurs', 'typeTicket'])
            ->where('id_utilisateur', $request->user()->id_utilisateur)
            ->orderBy('date_reservation', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data'    => TicketResource::collection($tickets),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTicketRequest $request)
    {
        $prixTotal   = 0;
        $nombreTotal = 0;

        $evenement = Evenement::find($request->id_evenement);

        if (!$evenement) {
            return response()->json([
                'success' => false,
                'message' => 'Événement non trouvé',
            ], 404);
        }

        foreach ($request->tickets as $item) {
            $typeTicket = $evenement->types_tickets()
                ->where('types_tickets.id_type_ticket', $item['id_type_ticket'])
                ->first();

            if (!$typeTicket) {
                return response()->json([
                    'success' => false,
                    'message' => 'Ce type de ticket n\'est pas disponible pour cet événement',
                ], 400);
            }

            if ($typeTicket->pivot->quantite_ticket_restante < $item['nombre_ticket_pris']) {
                return response()->json([
                    'success' => false,
                    'message' => 'Stock insuffisant pour le type : ' . $typeTicket->libelle,
                ], 400);
            }

            $prixTotal   += $item['nombre_ticket_pris'] * $typeTicket->prix_ticket;
            $nombreTotal += $item['nombre_ticket_pris'];
        }


        $ticket = Ticket::create([
            'id_utilisateur'     => $request->user()->id_utilisateur,
            'id_evenement'       => $request->id_evenement,
            'id_type_ticket'     => $request->tickets[0]['id_type_ticket'],
            'numero_ticket'      => 'TK-N°' . strtoupper(uniqid()),
            'date_reservation'   => now(),
            'nombre_ticket_pris' => $nombreTotal,
            'prix_total'         => $prixTotal,

        ]);

        $ticket->load(['evenement', 'typeTicket']);

        $user = $request->user();

        Mail::to($user->email)
            ->send(new TicketPaymentConfirmation($ticket));


        foreach ($request->tickets as $item) {
            $typeTicket = $evenement->types_tickets()
                ->where('types_tickets.id_type_ticket', $item['id_type_ticket'])
                ->first();

            $evenement->types_tickets()->updateExistingPivot(
                $item['id_type_ticket'],
                [
                    'quantite_ticket_restante' => $typeTicket->pivot->quantite_ticket_restante - $item['nombre_ticket_pris'],
                ]
            );
        }

        return response()->json([
            'success' => true,
            'message' => 'Ticket acheté avec succès',
            'data'    => new TicketResource($ticket),
        ], 201);
    }
    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $ticket = Ticket::with([
            'evenement.lieux',
            'evenement.organisateurs',
            'utilisateur',
            'typeTicket',
            'evenement',
            'evenement.lieux',
            'evenement.organisateurs',
        ])->find($id);


        if (!$ticket) {
            return response()->json([
                'success' => false,
                'message' => 'Ticket non trouvé',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => new TicketResource($ticket),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTicketRequest $request, string  $id)
    {
        $ticket = Ticket::find($id);

        if (!$ticket) {
            return response()->json([
                'success' => false,
                'message' => 'Ticket non trouvé',
            ], 404);
        }

        if ($request->has('tickets')) {
            $prixTotal   = 0;
            $nombreTotal = 0;

            foreach ($request->tickets as $item) {
                $typeTicket   = Type_ticket::find($item['id_type_ticket']);
                $prixTotal   += $item['nombre_ticket_pris'] * $typeTicket->prix;
                $nombreTotal += $item['nombre_ticket_pris'];
            }

            $ticket->update([
                'prix_total'         => $prixTotal,
                'nombre_ticket_pris' => $nombreTotal,
                'id_type_ticket'     => $request->tickets[0]['id_type_ticket'],
                'id_evenement'       => $request->id_evenement ?? $ticket->id_evenement,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Ticket mis à jour avec succès',
            'data'    => new TicketResource($ticket),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $ticket = Ticket::find($id);

        if (!$ticket) {
            return response()->json([
                'success' => false,
                'message' => 'Ticket non trouvé',
            ], 404);
        }

        $ticket->delete();

        return response()->json([
            'success' => true,
            'message' => 'Ticket supprimé avec succès',
        ]);
    }
}
