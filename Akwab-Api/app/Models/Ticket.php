<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Ticket extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'tickets';
    protected $primaryKey = 'id_ticket';

    protected $fillable = [
        'numero_ticket',
        'prix_total',
        'date_reservation',
        'nombre_ticket_pris',
        'id_utilisateur',
        'id_evenement',
        'id_type_ticket'
    ];

    protected function casts(): array
    {
        return [
            'date_reservation' => 'datetime',
            'prix_total'       => 'decimal:2',
        ];
    }

    public function utilisateur()
    {
        return $this->belongsTo(
            Utilisateur::class,
            'id_utilisateur',
            'id_utilisateur'
        );
    }

    public function evenement()
    {
        return $this->belongsTo(
            Evenement::class,
            'id_evenement',
            'id_evenement'
        );
    }


    public function typeTicket()
    {
        return $this->belongsTo(
            Type_Ticket::class,
            'id_type_ticket',
            'id_type_ticket'
        );
    }
}
