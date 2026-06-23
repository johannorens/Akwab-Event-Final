<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;

class Utilisateur extends Authenticatable implements CanResetPasswordContract
{
    use HasFactory, Notifiable, HasApiTokens, CanResetPassword, SoftDeletes;

    protected $table = 'utilisateurs';
    protected $primaryKey = 'id_utilisateur';

    protected $fillable = [
        'nom',
        'prenoms',
        'email',
        'telephone',
        'mot_de_passe',
        'id_role',
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


    public function getAuthPassword()
    {
        return $this->mot_de_passe;
    }


    public function sendPasswordResetNotification($token)
    {
        $url = "http://localhost:5173/reset-password?token={$token}&email={$this->email}";
        $this->notify(new \App\Notifications\CustomResetPassword($url));
    }


    public function role()
    {
        return $this->belongsTo(Role::class, 'id_role', 'id_role');
    }


    public function tickets()
    {
        return $this->hasMany(Ticket::class, 'id_utilisateur');
    }


    public function evenementsAimes()
    {
        return $this->belongsToMany(Evenement::class, 'utilisateur_evenement', 'id_utilisateur', 'id_evenement');
    }
}
