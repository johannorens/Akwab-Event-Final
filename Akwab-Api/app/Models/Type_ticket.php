<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Type_ticket extends Model
{
    use HasFactory, SoftDeletes;

    protected static function newFactory()
    {
        return \Database\Factories\TypeTicketFactory::new();
    }

    protected $table = 'types_tickets';

    protected $primaryKey = 'id_type_ticket';

    protected $fillable = [
        'libelle',
        'prix_ticket',
    ];

    public function tickets()
    {
        return $this->hasMany(Ticket::class, 'id_type_ticket');
    }

    public function evenements()
    {
        return $this->belongsToMany(Evenement::class, 'evenement_type_ticket', 'id_type_ticket', 'id_evenement')
            ->withPivot([
                'total_ticket_evenement',
                'quantite_ticket_restante',
                'quantite_type_ticket'
            ]);
    }
}
