<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Type_ticket extends Model
{
    use HasFactory;

    protected static function newFactory()
    {
        return \Database\Factories\TypeTicketFactory::new();
    }

    protected $table = 'types_tickets';

    protected $primaryKey = 'id_type_ticket';

    protected $fillable = [
        'libelle',
        'prix',
        'quantite_type_ticket'
    ];

    public function tickets()
    {
        return $this->hasMany(Ticket::class, 'id_type_ticket');
    }
}
