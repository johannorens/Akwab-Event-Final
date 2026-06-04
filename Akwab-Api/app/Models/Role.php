<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Role extends Model
{
    use HasFactory;

    protected $table = 'roles';

    protected $primaryKey = 'id_role';

    protected $fillable = [
        'libelle'
    ];

    public function utilisateurs()
    {
        return $this->hasMany(Utilisateur::class, 'id_role');
    }
}
