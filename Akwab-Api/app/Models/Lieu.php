<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lieu extends Model
{
    use HasFactory;

    protected $table = 'lieux';
    protected $primaryKey = 'id_lieu';

    protected $fillable = [
        'nom',
        'ville',
        'adresse',
    ];

    public function evenements()
    {
        return $this->belongsToMany(Evenement::class, 'derouler', 'id_lieu', 'id_evenement');
    }
}
