<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    use HasFactory;

    protected $table = 'tickets';
    protected $primaryKey = 'id_ticket';

    protected $fillable = [
        'numero_ticket',
        'prix_total',
        'date_reservation',
        'nombre_ticket_pris',
        'id_utilisateurs',
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
        return $this->belongsTo(User::class, 'id_utilisateurs');
    }


    public function evenements()
    {
        return $this->belongsToMany(Evenement::class, 'concerner', 'id_ticket', 'id_evenement');
    }


    public function typeTicket()
    {
        return $this->belongsToMany(Type_Ticket::class, 'correspondre', 'id_ticket', 'id_type_ticket');
    }
}
