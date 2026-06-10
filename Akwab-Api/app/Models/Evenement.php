<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Evenement extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'evenements';

    protected $primaryKey = 'id_evenement';

    protected $fillable = [
        'nom',
        'date',
        'description',
        'image',
        'id_categorie',
        'id_lieu',
        'id_organisateur',
    ];

    public function categories()
    {
        return $this->belongsTo(Categorie::class, 'id_categorie');
    }

    public function lieux()
    {
        return $this->belongsTo(Lieu::class, 'id_lieu');
    }

    public function organisateurs()
    {
        return $this->belongsTo(Organisateur::class, 'id_organisateur');
    }

    public function tickets()
    {
        return $this->hasMany(Ticket::class, 'id_evenement');
    }

    public function utilisateursAiment()
    {
        return $this->belongsToMany(Utilisateur::class, 'utilisateur_evenement', 'id_evenement', 'id_utilisateur');
    }

    public function types_tickets()
    {
        return $this->belongsToMany(Type_ticket::class, 'evenement_type_ticket', 'id_evenement',  'id_type_ticket')
            ->withPivot([
                'total_ticket_evenement',
                'quantite_ticket_restante',
                'quantite_type_ticket'
            ]);
    }
}
