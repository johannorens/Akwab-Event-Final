<?php

namespace Database\Factories;

use App\Models\Ticket;
use App\Models\Evenement;
use App\Models\Utilisateur;
use App\Models\Type_ticket;
use Illuminate\Database\Eloquent\Factories\Factory;

class TicketFactory extends Factory
{
    protected $model = Ticket::class;

    public function definition(): array
    {
        $typeTicket    = Type_ticket::first()    ?? Type_ticket::factory()->create();
        $evenement     = Evenement::first()      ?? Evenement::factory()->create();
        $utilisateur   = Utilisateur::first()    ?? Utilisateur::factory()->create();
        $nombreTickets = $this->faker->numberBetween(1, 5);

        return [
            'numero_ticket'      => 'TK-N°' . strtoupper(uniqid()),
            'prix_total'         => $typeTicket->prix_ticket * $nombreTickets,
            'date_reservation'   => now()->format('Y-m-d'),
            'nombre_ticket_pris' => $nombreTickets,
            'id_evenement'       => $evenement->id_evenement,
            'id_utilisateur'     => $utilisateur->id_utilisateur,
            'id_type_ticket'     => $typeTicket->id_type_ticket,
        ];
    }
}
