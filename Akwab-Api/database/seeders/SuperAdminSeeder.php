<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Utilisateur;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $role = Role::where('libelle', 'Administrateur')->first();

        Utilisateur::firstOrCreate(
            ['email' => 'admin@akwab.com'],
            [
                'nom'          => 'Admin',
                'prenoms'      => 'Super',
                'telephone'    => '00000000',
                'mot_de_passe' => bcrypt('admin1234'),
                'id_role'      => $role->id_role,
            ]
        );
    }
}
