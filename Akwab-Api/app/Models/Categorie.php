<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Categorie extends Model
{
    use HasFactory;

    protected $table = 'categories';
    protected $primaryKey = 'id_categorie';

    protected $fillable = [
        'libelle',
        'image',
    ];


    public function evenements()
    {
        return $this->belongsToMany(Evenement::class, 'appartenir', 'id_categorie', 'id_evenement');
    }
}
