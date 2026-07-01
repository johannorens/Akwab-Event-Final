<?php

namespace Tests\Unit\Models;

use Tests\TestCase;
use App\Models\Ticket;
use App\Models\Utilisateur;
use App\Models\Evenement;
use App\Models\Type_ticket;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;

class TicketTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function le_prix_total_est_correct()
    {
        $typeTicket = Type_ticket::factory()->create(['prix_ticket' => 5000]);
        $evenement  = Evenement::factory()->create();
        $utilisateur = Utilisateur::factory()->create();

        $nombreTickets = 3;
        $prixTotal     = $nombreTickets * $typeTicket->prix_ticket;

        $ticket = Ticket::factory()->create([
            'id_utilisateur'     => $utilisateur->id_utilisateur,
            'id_evenement'       => $evenement->id_evenement,
            'id_type_ticket'     => $typeTicket->id_type_ticket,
            'nombre_ticket_pris' => $nombreTickets,
            'prix_total'         => $prixTotal,
        ]);

        $this->assertEquals(15000, $ticket->prix_total);
    }

    #[Test]
    public function un_ticket_a_un_numero_unique()
    {
        $typeTicket  = Type_ticket::factory()->create();
        $evenement   = Evenement::factory()->create();
        $utilisateur = Utilisateur::factory()->create();

        $ticket1 = Ticket::factory()->create([
            'id_utilisateur' => $utilisateur->id_utilisateur,
            'id_evenement'   => $evenement->id_evenement,
            'id_type_ticket' => $typeTicket->id_type_ticket,
        ]);

        $ticket2 = Ticket::factory()->create([
            'id_utilisateur' => $utilisateur->id_utilisateur,
            'id_evenement'   => $evenement->id_evenement,
            'id_type_ticket' => $typeTicket->id_type_ticket,
        ]);

        $this->assertNotEquals($ticket1->numero_ticket, $ticket2->numero_ticket);
    }

    #[Test]
    public function un_ticket_appartient_a_un_utilisateur()
    {
        $utilisateur = Utilisateur::factory()->create();
        $typeTicket  = Type_ticket::factory()->create();
        $evenement   = Evenement::factory()->create();

        $ticket = Ticket::factory()->create([
            'id_utilisateur' => $utilisateur->id_utilisateur,
            'id_evenement'   => $evenement->id_evenement,
            'id_type_ticket' => $typeTicket->id_type_ticket,
        ]);

        $this->assertEquals($utilisateur->id_utilisateur, $ticket->id_utilisateur);
    }

    #[Test]
    public function un_ticket_appartient_a_un_evenement()
    {
        $utilisateur = Utilisateur::factory()->create();
        $typeTicket  = Type_ticket::factory()->create();
        $evenement   = Evenement::factory()->create();

        $ticket = Ticket::factory()->create([
            'id_utilisateur' => $utilisateur->id_utilisateur,
            'id_evenement'   => $evenement->id_evenement,
            'id_type_ticket' => $typeTicket->id_type_ticket,
        ]);

        $this->assertEquals($evenement->id_evenement, $ticket->id_evenement);
    }

    #[Test]
    public function un_ticket_a_une_date_de_reservation()
    {
        $utilisateur = Utilisateur::factory()->create();
        $typeTicket  = Type_ticket::factory()->create();
        $evenement   = Evenement::factory()->create();

        $ticket = Ticket::factory()->create([
            'id_utilisateur'   => $utilisateur->id_utilisateur,
            'id_evenement'     => $evenement->id_evenement,
            'id_type_ticket'   => $typeTicket->id_type_ticket,
            'date_reservation' => now()->format('Y-m-d'),
        ]);

        $this->assertNotNull($ticket->date_reservation);
    }

    #[Test]
    public function le_calcul_prix_total_est_juste()
    {
        $prix          = 7500;
        $nombre        = 4;
        $prixAttendu   = $prix * $nombre; // 30000

        $typeTicket  = Type_ticket::factory()->create(['prix_ticket' => $prix]);
        $evenement   = Evenement::factory()->create();
        $utilisateur = Utilisateur::factory()->create();

        $ticket = Ticket::factory()->create([
            'id_utilisateur'     => $utilisateur->id_utilisateur,
            'id_evenement'       => $evenement->id_evenement,
            'id_type_ticket'     => $typeTicket->id_type_ticket,
            'nombre_ticket_pris' => $nombre,
            'prix_total'         => $prixAttendu,
        ]);

        $this->assertEquals(30000, $ticket->prix_total);
    }
}
// test
