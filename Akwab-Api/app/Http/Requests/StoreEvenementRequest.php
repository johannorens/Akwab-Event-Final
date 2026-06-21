<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;

class StoreEvenementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'id_lieu'         => (int) $this->id_lieu,
            'id_categorie'    => (int) $this->id_categorie,
            'id_organisateur' => (int) $this->id_organisateur,
        ]);
    }
    public function rules(): array
    {
        return [
            'nom'                            => 'required|string|max:255',
            'date'                           => 'required|date',
            'description'                    => 'required|string',
            'image'                          => 'required|image|mimes:jpeg,png,jpg|max:2048',
            'id_categorie'                   => 'required|exists:categories,id_categorie',
            'id_lieu'                        => 'required|exists:lieux,id_lieu',
            'id_organisateur'                => 'required|exists:organisateurs,id_organisateur',
            // 'total_ticket_evenement'         => 'required|integer|min:1',
            'tickets'                        => 'required|array|min:1',
            'tickets.*.libelle'              => 'required|string|max:255',
            'tickets.*.prix_ticket'          => 'required|numeric|min:0',
            'tickets.*.quantite_type_ticket' => 'required|integer|min:1',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Erreur de validation',
            'errors'  => $validator->errors()
        ], 422));
    }
}
