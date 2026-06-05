<?php

namespace Database\Factories;

use App\Models\Ticket;
use App\Models\Evenement;
use App\Models\Utilisateur;
use App\Models\Type_ticket;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Ticket>
 */
class TicketFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

        $typeTicket = Type_ticket::inRandomOrder()->first();
        $nombreTickets = $this->faker->numberBetween(1, 5);

        return [
            'numero_ticket' => $this->faker->unique()->numberBetween(1, 10000),
            'prix_total'  => $typeTicket->prix * $nombreTickets,
            'date_reservation'   => now()->format('Y-m-d'),
            'nombre_ticket_pris' => $nombreTickets,
            'id_evenement' => Evenement::inRandomOrder()->first()->id_evenement,
            'id_utilisateur' => Utilisateur::inRandomOrder()->first()->id_utilisateur,
            'id_type_ticket' => $typeTicket->id_type_ticket,
        ];
    }
}
