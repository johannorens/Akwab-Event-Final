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

        Role::create(['libelle' => 'Administrateur']);
        Role::create(['libelle' => 'Utilisateur']);
        Lieu::factory(10)->create();
        Categorie::factory(5)->create();
        Organisateur::factory(10)->create();
        Type_ticket::factory(10)->create();
        $this->call(SuperAdminSeeder::class);
        Utilisateur::factory(10)->create();
        Evenement::factory(10)->create();
        Ticket::factory(10)->create();
    }
}
