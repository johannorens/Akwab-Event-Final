<?php

namespace Tests\Feature\Auth;

use Tests\TestCase;
use App\Models\Utilisateur;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use PHPUnit\Framework\Attributes\Test;
class AuthTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function un_utilisateur_peut_sinscrire()
    {
        $response = $this->postJson('/api/register', [
            'nom'                       => 'Kouassi',
            'prenoms'                   => 'Jean',
            'email'                     => 'jean@example.com',
            'telephone'                 => '0102030405',
            'mot_de_passe'              => 'Password@123',
            'mot_de_passe_confirmation' => 'Password@123',
        ]);

        $response->assertStatus(201)
                 ->assertJsonFragment(['success' => true])
                 ->assertJsonStructure(['token', 'user']);

        $this->assertDatabaseHas('utilisateurs', ['email' => 'jean@example.com']);
    }

    #[Test]
    public function linscription_echoue_si_email_deja_pris()
    {
        Utilisateur::factory()->create(['email' => 'jean@example.com']);

        $this->postJson('/api/register', [
            'nom'                       => 'Autre',
            'prenoms'                   => 'Jean',
            'email'                     => 'jean@example.com',
            'telephone'                 => '0102030405',
            'mot_de_passe'              => 'Password@123',
            'mot_de_passe_confirmation' => 'Password@123',
        ])->assertStatus(422);
    }

    #[Test]
    public function linscription_echoue_sans_confirmation_mot_de_passe()
    {
        $this->postJson('/api/register', [
            'nom'          => 'Kouassi',
            'prenoms'      => 'Jean',
            'email'        => 'jean@example.com',
            'telephone'    => '0102030405',
            'mot_de_passe' => 'Password@123',
        ])->assertStatus(422);
    }

    #[Test]
    public function un_utilisateur_peut_se_connecter()
    {
        Utilisateur::factory()->create([
            'email'        => 'jean@example.com',
            'mot_de_passe' => Hash::make('Password@123'),
        ]);

        $this->postJson('/api/login', [
            'email'        => 'jean@example.com',
            'mot_de_passe' => 'Password@123',
        ])->assertStatus(200)
          ->assertJsonFragment(['success' => true])
          ->assertJsonStructure(['token', 'user']);
    }

    #[Test]
    public function le_login_echoue_avec_mauvais_mot_de_passe()
    {
        Utilisateur::factory()->create([
            'email'        => 'jean@example.com',
            'mot_de_passe' => Hash::make('Password@123'),
        ]);

        $this->postJson('/api/login', [
            'email'        => 'jean@example.com',
            'mot_de_passe' => 'mauvais_mdp',
        ])->assertStatus(401)
          ->assertJsonFragment(['success' => false]);
    }

    #[Test]
    public function le_login_echoue_avec_email_inexistant()
    {
        $this->postJson('/api/login', [
            'email'        => 'inconnu@example.com',
            'mot_de_passe' => 'Password@123',
        ])->assertStatus(401);
    }

    #[Test]
    public function un_utilisateur_connecte_peut_se_deconnecter()
    {
        $utilisateur = Utilisateur::factory()->create();

        $this->actingAs($utilisateur, 'sanctum')
             ->postJson('/api/logout')
             ->assertStatus(200)
             ->assertJsonFragment(['success' => true]);
    }

    #[Test]
    public function un_invite_ne_peut_pas_se_deconnecter()
    {
        $this->postJson('/api/logout')
             ->assertStatus(401);
    }
}

// ndhjdjndbhe
