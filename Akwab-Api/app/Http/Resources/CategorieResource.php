<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategorieResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id_categorie'      => $this->id_categorie,
            'libelle' => $this->libelle,
            'image'   => $this->image
            ? asset('storage/' . $this->image)
            : null,
        ];
    }
}
