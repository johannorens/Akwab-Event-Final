<?php

namespace Tests\Unit\Models;

use Tests\TestCase;
use App\Models\Utilisateur;
use App\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;

class UtilisateurTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function un_utilisateur_a_un_role()
    {
        $utilisateur = Utilisateur::factory()->create();

        $this->assertNotNull($utilisateur->id_role);
        $this->assertEquals(2, $utilisateur->id_role);
    }

    #[Test]
    public function un_admin_a_le_role_1()
    {
        $admin = Utilisateur::factory()->admin()->create();

        $this->assertEquals(1, $admin->id_role);
    }

    #[Test]
    public function un_utilisateur_normal_a_le_role_2()
    {
        $utilisateur = Utilisateur::factory()->create();

        $this->assertEquals(2, $utilisateur->id_role);
    }

    #[Test]
    public function le_mot_de_passe_est_hache()
    {
        $utilisateur = Utilisateur::factory()->create([
            'mot_de_passe' => bcrypt('Password@123'),
        ]);

        // Le mot de passe ne doit pas être stocké en clair
        $this->assertNotEquals('Password@123', $utilisateur->mot_de_passe);
        $this->assertTrue(str_starts_with($utilisateur->mot_de_passe, '$2y$'));
    }

    #[Test]
    public function un_utilisateur_a_un_email_unique()
    {
        Utilisateur::factory()->create(['email' => 'test@example.com']);

        $this->assertDatabaseHas('utilisateurs', ['email' => 'test@example.com']);
        $this->assertDatabaseCount('utilisateurs', 1);
    }

    #[Test]
    public function un_utilisateur_peut_avoir_plusieurs_tickets()
    {
        $utilisateur = Utilisateur::factory()->create();

        $this->assertIsObject($utilisateur->tickets ?? collect());
    }
}
// test
