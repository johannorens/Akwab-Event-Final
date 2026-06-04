<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Type_ticket extends Model
{
    use HasFactory;

    protected $table = 'type_tikets';

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
