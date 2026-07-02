<?php

namespace Database\Seeders;

use App\Models\Categorie;
use App\Models\Evenement;
use App\Models\Lieu;
use App\Models\Organisateur;
use App\Models\Role;
use App\Models\Ticket;
use App\Models\Type_ticket;
use App\Models\User;
use App\Models\Utilisateur;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(RoleSeeder::class);

        Lieu::factory(10)->create();
        Categorie::factory(5)->create();
        Organisateur::factory(10)->create();
        Type_ticket::factory(10)->create();
        $this->call(SuperAdminSeeder::class);
        Utilisateur::factory(10)->create();

        $evenements = Evenement::factory(10)->create();

        Type_ticket::factory()->count(2)->create();
        $typesTickets = Type_ticket::all();

        foreach ($evenements as $evenement) {

            $quantites = [
                'VIP' => fake()->numberBetween(50, 500),
                'GRAND PUBLIC' => fake()->numberBetween(200, 1000),
            ];
            $totalEvenement = array_sum($quantites);
            foreach ($typesTickets as $type) {
                $quantite = $quantites[$type->libelle];
                $restant = $totalEvenement - $quantite;

                $evenement->types_tickets()->attach(
                    $type->id_type_ticket,
                    [
                        'total_ticket_evenement'   => $totalEvenement,
                        'quantite_ticket_restante' => $restant,
                        'quantite_type_ticket'     => $quantite,
                    ]
                );
            }
        }

        Ticket::factory(10)->create();
    }
}
