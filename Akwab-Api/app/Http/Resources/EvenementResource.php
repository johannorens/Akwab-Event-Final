<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EvenementResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id_evenement'  => $this->id_evenement,
            'nom'  => $this->nom,
            'date'  => $this->date,
            'description'  => $this->description,
            'image'  => $this->image,
            'quantite_ticket_totale'  => $this->quantite_ticket_totale,
            'quantite_ticket_restante'  => $this->quantite_ticket_restante,

            'categorie'  => $this->categorie->map(function ($categorie) {
                return [
                    'id_categorie' => $categorie->id_categorie,
                    'libelle' => $categorie->libelle
                ];
            }),

            'lieu'  => $this->lieu->map(function ($lieu) {
                return [
                    'id_lieu' => $lieu->id_lieu,
                    'nom' => $lieu->nom,
                    'ville' => $lieu->ville,
                    'adresse' => $lieu->adresse,
                ];
            }),

            'organisateur'  => $this->organisateur->map(function ($organisateur) {
                return [
                    'id_organisateur' => $organisateur->id_organisateur,
                    'nom' => $organisateur->nom,
                    'email' => $organisateur->email,
                    'adresse' => $organisateur->adresse,
                ];
            }),

            'likes_count'  => $this->whenCounted('utilisateursAiment')

        ];
    }
}
