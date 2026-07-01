<?php

namespace Tests\Feature\Tickets;

use Tests\TestCase;
use App\Models\Utilisateur;
use App\Models\Evenement;
use App\Models\Ticket;
use App\Models\Type_ticket;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use PHPUnit\Framework\Attributes\Test;

class TicketTest extends TestCase
{
    use RefreshDatabase;

    private function adminUser(): Utilisateur
    {
        return Utilisateur::factory()->admin()->create();
    }

    private function normalUser(): Utilisateur
    {
        return Utilisateur::factory()->create();
    }

    private function creerEvenementAvecTicket(int $quantite = 10, int $prix = 5000): array
    {
        $evenement  = Evenement::factory()->create();
        $typeTicket = Type_ticket::factory()->create(['prix_ticket' => $prix]);

        $evenement->types_tickets()->attach($typeTicket->id_type_ticket, [
            'total_ticket_evenement'   => $quantite,
            'quantite_type_ticket'     => $quantite,
            'quantite_ticket_restante' => $quantite,
        ]);

        return [$evenement, $typeTicket];
    }

    #[Test]
    public function un_utilisateur_peut_voir_ses_tickets()
    {
        $user       = $this->normalUser();
        $typeTicket = Type_ticket::factory()->create();
        $evenement  = Evenement::factory()->create();

        Ticket::factory()->create([
            'id_utilisateur' => $user->id_utilisateur,
            'id_evenement'   => $evenement->id_evenement,
            'id_type_ticket' => $typeTicket->id_type_ticket,
        ]);

        $this->actingAs($user, 'sanctum')
            ->getJson('/api/mes-tickets')
            ->assertStatus(200)
            ->assertJsonFragment(['success' => true]);
    }

    #[Test]
    public function un_invite_ne_peut_pas_voir_ses_tickets()
    {
        $this->getJson('/api/mes-tickets')
            ->assertStatus(401);
    }

    #[Test]
    public function un_utilisateur_peut_reserver_un_ticket()
    {
        Mail::fake();

        $user = $this->normalUser();
        [$evenement, $typeTicket] = $this->creerEvenementAvecTicket(10, 5000);

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/tickets', [
                'id_evenement' => $evenement->id_evenement,
                'tickets'      => [
                    [
                        'id_type_ticket'     => $typeTicket->id_type_ticket,
                        'nombre_ticket_pris' => 2,
                    ],
                ],
            ])->assertStatus(201)
            ->assertJsonFragment(['success' => true]);

        $this->assertDatabaseHas('tickets', [
            'id_utilisateur'     => $user->id_utilisateur,
            'id_evenement'       => $evenement->id_evenement,
            'nombre_ticket_pris' => 2,
            'prix_total'         => 10000,
        ]);
    }

    #[Test]
    public function le_stock_diminue_apres_reservation()
    {
        Mail::fake();

        $user = $this->normalUser();
        [$evenement, $typeTicket] = $this->creerEvenementAvecTicket(10);

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/tickets', [
                'id_evenement' => $evenement->id_evenement,
                'tickets'      => [
                    [
                        'id_type_ticket'     => $typeTicket->id_type_ticket,
                        'nombre_ticket_pris' => 3,
                    ],
                ],
            ])->assertStatus(201);

        $pivot = $evenement->types_tickets()
            ->where('types_tickets.id_type_ticket', $typeTicket->id_type_ticket)
            ->first();

        $this->assertEquals(7, $pivot->pivot->quantite_ticket_restante);
    }

    #[Test]
    public function reservation_echoue_si_stock_insuffisant()
    {
        $user = $this->normalUser();
        [$evenement, $typeTicket] = $this->creerEvenementAvecTicket(2);

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/tickets', [
                'id_evenement' => $evenement->id_evenement,
                'tickets'      => [
                    [
                        'id_type_ticket'     => $typeTicket->id_type_ticket,
                        'nombre_ticket_pris' => 5,
                    ],
                ],
            ])->assertStatus(400)
            ->assertJsonFragment(['success' => false]);
    }

    #[Test]
    public function reservation_echoue_si_evenement_inexistant()
    {
        $user = $this->normalUser();

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/tickets', [
                'id_evenement' => 9999,
                'tickets'      => [
                    ['id_type_ticket' => 1, 'nombre_ticket_pris' => 1],
                ],
            ])->assertStatus(422); // La validation bloque avant le controller
    }

    #[Test]
    public function reservation_echoue_si_type_ticket_pas_pour_cet_evenement()
    {
        $user      = $this->normalUser();
        $evenement = Evenement::factory()->create();
        $autreType = Type_ticket::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/tickets', [
                'id_evenement' => $evenement->id_evenement,
                'tickets'      => [
                    [
                        'id_type_ticket'     => $autreType->id_type_ticket,
                        'nombre_ticket_pris' => 1,
                    ],
                ],
            ])->assertStatus(400)
            ->assertJsonFragment(['success' => false]);
    }

    #[Test]
    public function un_invite_ne_peut_pas_reserver_un_ticket()
    {
        $this->postJson('/api/tickets', [])
            ->assertStatus(401);
    }

    #[Test]
    public function un_utilisateur_peut_voir_un_ticket_par_id()
    {
        $user       = $this->normalUser();
        $typeTicket = Type_ticket::factory()->create();
        $evenement  = Evenement::factory()->create();

        $ticket = Ticket::factory()->create([
            'id_utilisateur' => $user->id_utilisateur,
            'id_evenement'   => $evenement->id_evenement,
            'id_type_ticket' => $typeTicket->id_type_ticket,
        ]);

        $this->actingAs($user, 'sanctum')
            ->getJson("/api/tickets/{$ticket->id_ticket}")
            ->assertStatus(200)
            ->assertJsonFragment(['success' => true]);
    }

    #[Test]
    public function show_retourne_404_si_ticket_inexistant()
    {
        $user = $this->normalUser();

        $this->actingAs($user, 'sanctum')
            ->getJson('/api/tickets/9999')
            ->assertStatus(404);
    }

    #[Test]
    public function un_admin_peut_lister_tous_les_tickets()
    {
        $admin = $this->adminUser();

        $this->actingAs($admin, 'sanctum')
            ->getJson('/api/tickets')
            ->assertStatus(200);
    }

    #[Test]
    public function un_utilisateur_normal_ne_peut_pas_lister_tous_les_tickets()
    {
        $user = $this->normalUser();

        $this->actingAs($user, 'sanctum')
            ->getJson('/api/tickets')
            ->assertStatus(403);
    }

    #[Test]
    public function un_admin_peut_supprimer_un_ticket()
    {
        Mail::fake();

        $admin      = $this->adminUser();
        $typeTicket = Type_ticket::factory()->create();
        $evenement  = Evenement::factory()->create();

        $ticket = Ticket::factory()->create([
            'id_utilisateur' => $admin->id_utilisateur,
            'id_evenement'   => $evenement->id_evenement,
            'id_type_ticket' => $typeTicket->id_type_ticket,
        ]);

        $this->actingAs($admin, 'sanctum')
            ->deleteJson("/api/tickets/{$ticket->id_ticket}")
            ->assertStatus(200)
            ->assertJsonFragment(['success' => true]);
    }
}
// test
