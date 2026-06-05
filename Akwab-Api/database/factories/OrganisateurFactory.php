<?php

namespace Database\Factories;

use App\Models\Organisateur;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Organisateur>
 */
class OrganisateurFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nom' => $this->faker->lastName(),
            'description' => $this->faker->paragraph(),
            'email' => $this->faker->unique()->safeEmail(),
            'telephone'   => $this->faker->phoneNumber(),
        ];
    }
}
