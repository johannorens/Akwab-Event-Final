<?php

namespace Database\Factories;

use App\Models\Evenement;
use App\Models\Categorie;
use App\Models\Lieu;
use App\Models\Organisateur;
use Illuminate\Database\Eloquent\Factories\Factory;

class EvenementFactory extends Factory
{
    protected $model = Evenement::class;

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

        $categorie    = Categorie::first()    ?? Categorie::factory()->create();
        $lieu         = Lieu::first()         ?? Lieu::factory()->create();
        $organisateur = Organisateur::first() ?? Organisateur::factory()->create();

        return [
            'nom'             => $this->faker->randomElement($noms),
            'date'            => $this->faker->dateTimeBetween('+1 week', '+6 months')->format('Y-m-d'),
            'description'     => $this->faker->paragraph(),
            'image'           => 'evenements/default.webp',
            'id_categorie'    => $categorie->id_categorie,
            'id_lieu'         => $lieu->id_lieu,
            'id_organisateur' => $organisateur->id_organisateur,
        ];
    }
}
