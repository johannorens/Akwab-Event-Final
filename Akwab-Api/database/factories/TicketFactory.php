<?php

namespace Database\Factories;

use App\Models\Ticket;
use App\Models\Evenement;
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
        $prix        = $this->faker->randomElement([10000, 15000, 25000, 50000]);
        $nombreTickets = $this->faker->numberBetween(1, 100);

        return [
            'numero_ticket' => $this->faker->numberBetween(1, 10000),
            'prix_total'  => $prix * $nombreTickets,
            'date_reservation'   => now()->format('Y-m-d'),
            'nombre_ticket_pris' => $nombreTickets,
            'id_evenement' => Evenement::inRandomOrder()->first()->id_evenement,
            'id_type_ticket' => Type_ticket::inRandomOrder()->first()->id_type_ticket,
        ];
    }
}
