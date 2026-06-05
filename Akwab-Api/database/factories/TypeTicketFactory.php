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

    protected $model = Type_ticket::class;

    public function definition(): array
    {
        return [
            'libelle' => $this->faker->randomElement([
                'VIP',
                'GRAND PUBLIC',
            ]),
            'prix' => $this->faker->numberBetween(1000, 10000),
            'quantite_type_ticket' => $this->faker->numberBetween(50, 200),
        ];
    }
}
