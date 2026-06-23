<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TicketResource extends JsonResource
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */ public function toArray(Request $request): array
    {
        return [
            'id'                 => $this->id_ticket,
            'numero_ticket'      => $this->numero_ticket,
            'prix_total'         => $this->prix_total,
            'date_reservation'   => $this->date_reservation?->toDateTimeString(),
            'nombre_ticket_pris' => $this->nombre_ticket_pris,


            'id_utilisateur'     => $this->id_utilisateur,
            'id_evenement'       => $this->id_evenement,
            'id_type_ticket'     => $this->id_type_ticket,


            'utilisateur' => $this->whenLoaded('utilisateur'),
            'type_ticket' => $this->whenLoaded('typeTicket'),
            'evenement'   => $this->whenLoaded('evenement'),
            // 'id_evenement'       => $this->id_evenement,
            // 'id_type_ticket'     => $this->id_type_ticket,

        
        ];
    }
}
