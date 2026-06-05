<?php

namespace Database\Factories;

use App\Models\Lieu;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Lieu>
 */
class LieuFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

        $lieux = [
            ['nom' => 'Palais de la Culture', 'ville' => 'Abidjan', 'adresse' => 'Avenue Terrasson de Fougères'],
            ['nom' => 'Stade Félix Houphouët-Boigny', 'ville' => 'Abidjan', 'adresse' => 'Boulevard de la République'],
            ['nom' => 'Sofitel Abidjan Hôtel Ivoire', 'ville' => 'Abidjan', 'adresse' => 'Boulevard Hassan II'],
            ['nom' => 'Centre Culturel Français', 'ville' => 'Abidjan', 'adresse' => 'Rue du Commerce'],
            ['nom' => 'Espace Latrille Events', 'ville' => 'Abidjan', 'adresse' => 'Rue des Jardins, Cocody'],
        ];

        $lieu = $this->faker->randomElement($lieux);

        return [
            'nom' => $lieu['nom'],
            'ville'=> $lieu['ville'],
            'adresse' => $lieu['adresse'],
        ];
    }
}
