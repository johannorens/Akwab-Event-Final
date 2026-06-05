<?php

namespace Database\Factories;

use App\Models\Type_ticket;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Type_ticket>
 */
class TypeTicketFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'libelle' => $this->faker->unique()->randomElement([
                'VIP',
                'GRAND PUBLIC',
            ]),
        ];
    }
}
