<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Evenement extends Model
{
    use HasFactory;

    protected $table = 'evenements';

    protected $primaryKey = 'id_evenement';

    protected $fillable = [
        'nom',
        'date',
        'description',
        'image',
        'quantite_ticket_totale',
        'quantite_ticket_restante',
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
        return $this->belongsToMany(Utilisateur::class, 'aimer', 'id_evenement', 'id_utilisateur');
    }

}
