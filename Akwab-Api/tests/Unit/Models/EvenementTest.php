<?php

namespace Tests\Unit\Models;

use Tests\TestCase;
use App\Models\Evenement;
use App\Models\Type_ticket;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;

class EvenementTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function un_evenement_peut_avoir_des_types_tickets()
    {
        $evenement  = Evenement::factory()->create();
        $typeTicket = Type_ticket::factory()->create();

        $evenement->types_tickets()->attach($typeTicket->id_type_ticket, [
            'total_ticket_evenement'   => 100,
            'quantite_type_ticket'     => 100,
            'quantite_ticket_restante' => 100,
        ]);

        $this->assertCount(1, $evenement->types_tickets);
    }

    #[Test]
    public function un_evenement_a_une_date()
    {
        $evenement = Evenement::factory()->create([
            'date' => '2026-12-01',
        ]);

        $this->assertEquals('2026-12-01', $evenement->date);
    }

    #[Test]
    public function un_evenement_a_un_nom()
    {
        $evenement = Evenement::factory()->create([
            'nom' => 'Concert Abidjan',
        ]);

        $this->assertEquals('Concert Abidjan', $evenement->nom);
    }

    #[Test]
    public function un_evenement_a_une_description()
    {
        $evenement = Evenement::factory()->create([
            'description' => 'Une belle soirée musicale.',
        ]);

        $this->assertEquals('Une belle soirée musicale.', $evenement->description);
    }

    #[Test]
    public function la_quantite_restante_diminue_apres_reservation()
    {
        $evenement  = Evenement::factory()->create();
        $typeTicket = Type_ticket::factory()->create(['prix_ticket' => 5000]);

        $evenement->types_tickets()->attach($typeTicket->id_type_ticket, [
            'total_ticket_evenement'   => 10,
            'quantite_type_ticket'     => 10,
            'quantite_ticket_restante' => 10,
        ]);

        // Simule une réduction du stock
        $evenement->types_tickets()->updateExistingPivot(
            $typeTicket->id_type_ticket,
            ['quantite_ticket_restante' => 7]
        );

        $pivot = $evenement->types_tickets()
                           ->where('types_tickets.id_type_ticket', $typeTicket->id_type_ticket)
                           ->first();

        $this->assertEquals(7, $pivot->pivot->quantite_ticket_restante);
    }

    #[Test]
    public function un_evenement_est_complet_si_stock_zero()
    {
        $evenement  = Evenement::factory()->create();
        $typeTicket = Type_ticket::factory()->create();

        $evenement->types_tickets()->attach($typeTicket->id_type_ticket, [
            'total_ticket_evenement'   => 10,
            'quantite_type_ticket'     => 10,
            'quantite_ticket_restante' => 0,
        ]);

        $pivot = $evenement->types_tickets()->first();

        $this->assertEquals(0, $pivot->pivot->quantite_ticket_restante);
    }
}
// test
