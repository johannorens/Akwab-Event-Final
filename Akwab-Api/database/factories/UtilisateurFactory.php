<?php

namespace Database\Factories;

use App\Models\Utilisateur;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Role;


/**
 * @extends Factory<Utilisateur>
 */
class UtilisateurFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nom'  => $this->faker->lastName(),
            'prenoms' => $this->faker->firstName(),
            'email'   => $this->faker->unique()->safeEmail(),
            'telephone' => $this->faker->phoneNumber(),
            'mot_de_passe' => bcrypt('password'),
            'id_role' => Role::inRandomOrder()->first()->id_role,
        ];
    }
}
