<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Utilisateur extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $table = 'utilisateurs';
    protected $primaryKey = 'id_utilisateurs';

    protected $fillable = [
        'nom',
        'prenoms',
        'email',
        'telephone',
        'mot_de_passe',
    ];

    protected $hidden = [
        'mot_de_passe',
    ];

    protected function casts(): array
    {
        return [
            'mot_de_passe' => 'hashed',
        ];
    }


    public function role()
    {
        return $this->belongsToMany(Role::class, 'possede', 'id_utilisateurs', 'id_role');
    }


    public function tickets()
    {
        return $this->hasMany(Ticket::class, 'id_utilisateurs');
    }


    public function evenementsAimes()
    {
        return $this->belongsToMany(Evenement::class, 'aimer', 'id_utilisateurs', 'id_evenement');
    }
}
