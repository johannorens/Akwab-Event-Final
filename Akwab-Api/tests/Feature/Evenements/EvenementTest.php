<?php

namespace Tests\Feature\Evenements;

use Tests\TestCase;
use App\Models\Utilisateur;
use App\Models\Evenement;
use App\Models\Categorie;
use App\Models\Lieu;
use App\Models\Organisateur;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;

class EvenementTest extends TestCase
{
    use RefreshDatabase;

    private function adminUser(): Utilisateur
    {
        return Utilisateur::factory()->admin()->create();
    }
// ndhdhdhdhd
    private function normalUser(): Utilisateur
    {
        return Utilisateur::factory()->create();
    }

    #[Test]
    public function nimporte_qui_peut_lister_les_evenements()
    {
        $this->getJson('/api/evenements')
            ->assertStatus(200);
    }

    #[Test]
    public function nimporte_qui_peut_voir_un_evenement()
    {
        $evenement = Evenement::factory()->create();

        $this->getJson("/api/evenements/{$evenement->id_evenement}")
            ->assertStatus(200);
    }

    #[Test]
    public function show_retourne_404_si_evenement_inexistant()
    {
        $this->getJson('/api/evenements/9999')
            ->assertStatus(404);
    }

    #[Test]
    public function un_admin_peut_creer_un_evenement()
    {
        $admin        = $this->adminUser();
        $categorie    = Categorie::first()    ?? Categorie::factory()->create();
        $lieu         = Lieu::first()         ?? Lieu::factory()->create();
        $organisateur = Organisateur::first() ?? Organisateur::factory()->create();

        $fakeImage = \Illuminate\Http\UploadedFile::fake()->image('evenement.jpg', 800, 600);

        $payload = [
            'nom'             => 'Festival Jazz Abidjan',
            'date'            => now()->addMonth()->format('Y-m-d'),
            'description'     => 'Un grand festival.',
            'image'           => $fakeImage,
            'id_categorie'    => $categorie->id_categorie,
            'id_lieu'         => $lieu->id_lieu,
            'id_organisateur' => $organisateur->id_organisateur,
            'tickets'         => [
                [
                    'libelle'              => 'Standard',
                    'prix_ticket'          => 5000,
                    'quantite_type_ticket' => 100,
                ],
            ],
        ];

        \Illuminate\Support\Facades\Storage::fake('public');

        $this->actingAs($admin, 'sanctum')
            ->postJson('/api/evenements', $payload)
            ->assertStatus(201)
            ->assertJsonFragment(['success' => true]);
    }

    #[Test]
    public function un_utilisateur_normal_ne_peut_pas_creer_un_evenement()
    {
        $user = $this->normalUser();

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/evenements', [
                'nom'  => 'Test',
                'date' => now()->addMonth()->format('Y-m-d'),
            ])->assertStatus(403);
    }

    #[Test]
    public function un_invite_ne_peut_pas_creer_un_evenement()
    {
        $this->postJson('/api/evenements', ['nom' => 'Test'])
            ->assertStatus(401);
    }

    #[Test]
    public function un_admin_peut_modifier_un_evenement()
    {
        $admin        = $this->adminUser();
        $evenement    = Evenement::factory()->create();
        $categorie    = Categorie::first()    ?? Categorie::factory()->create();
        $lieu         = Lieu::first()         ?? Lieu::factory()->create();
        $organisateur = Organisateur::first() ?? Organisateur::factory()->create();

        $this->actingAs($admin, 'sanctum')
            ->putJson("/api/evenements/{$evenement->id_evenement}", [
                'nom'             => 'Nouveau nom',
                'date'            => now()->addMonth()->format('Y-m-d'),
                'description'     => 'Nouvelle description',
                'id_categorie'    => $categorie->id_categorie,
                'id_lieu'         => $lieu->id_lieu,
                'id_organisateur' => $organisateur->id_organisateur,
            ])->assertStatus(200)
            ->assertJsonFragment(['success' => true]);

        $this->assertDatabaseHas('evenements', ['nom' => 'Nouveau nom']);
    }

    #[Test]
    public function un_utilisateur_normal_ne_peut_pas_modifier_un_evenement()
    {
        $user      = $this->normalUser();
        $evenement = Evenement::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->putJson("/api/evenements/{$evenement->id_evenement}", ['nom' => 'Hack'])
            ->assertStatus(403);
    }

    #[Test]
    public function un_admin_peut_supprimer_un_evenement()
    {
        $admin     = $this->adminUser();
        $evenement = Evenement::factory()->create();

        $this->actingAs($admin, 'sanctum')
            ->deleteJson("/api/evenements/{$evenement->id_evenement}")
            ->assertStatus(200)
            ->assertJsonFragment(['success' => true]);
    }

    #[Test]
    public function un_utilisateur_normal_ne_peut_pas_supprimer_un_evenement()
    {
        $user      = $this->normalUser();
        $evenement = Evenement::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->deleteJson("/api/evenements/{$evenement->id_evenement}")
            ->assertStatus(403);
    }
}
