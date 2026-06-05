<?php

namespace Database\Factories;

use App\Models\Evenement;
use App\Models\Categorie;
use App\Models\Lieu;
use App\Models\Organisateur;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Evenement>
 */
class EvenementFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {


        $noms = [
            'Concert Abidjan by Night',
            'Festival des Arts',
            'Conférence Tech Africa',
            'Soirée Afrobeats',
            'Forum Entrepreneuriat CI',
            'Gala de Charité Abidjan',
            'Festival du Film Africain',
            'Tournoi de Football Inter-Quartiers',
        ];

        return [
            'nom'             => $this->faker->unique()->randomElement($noms),
            'date'            => $this->faker->dateTimeBetween('+1 week', '+6 months')->format('Y-m-d'),
            'description'     => $this->faker->paragraphs(),
            'image'           => null,
            'quantite_ticket_total' => $this->faker->numberBetween(100, 1000),
            'quantite_ticket_restante' => $this->faker->numberBetween(100, 1000),
            'id_categorie' => Categorie::inRandomOrder()->first()->id_categorie,
            'id_lieu' => Lieu::inRandomOrder()->first()->id_lieu,
            'id_organisateur' => Organisateur::inRandomOrder()->first()->id_organisateur,


        ];
    }
}
