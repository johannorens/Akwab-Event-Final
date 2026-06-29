<?php

namespace Database\Factories;

use App\Models\Utilisateur;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

class UtilisateurFactory extends Factory
{
    protected $model = Utilisateur::class;

    public function definition(): array
    {
        return [
            'nom'          => $this->faker->lastName(),
            'prenoms'      => $this->faker->firstName(),
            'email'        => $this->faker->unique()->safeEmail(),
            'telephone'    => $this->faker->phoneNumber(),
            'mot_de_passe' => Hash::make('Password@123'),
            'id_role'      => 2,
        ];
    }

    public function admin(): static
    {
        return $this->state(['id_role' => 1]);
    }
}
