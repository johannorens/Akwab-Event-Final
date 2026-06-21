<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;

class UpdateEvenementRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */


    /**
     * Prepare the data for validation.
     */
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
            'nom'                            => 'sometimes|string|max:255',
            'date'                           => 'sometimes|date',
            'description'                    => 'sometimes|string',
            'image'                          => 'sometimes|image|mimes:jpeg,png,jpg|max:2048',
            'id_categorie'                   => 'sometimes|exists:categories,id_categorie',
            'id_lieu'                        => 'sometimes|exists:lieux,id_lieu',
            'id_organisateur'                => 'sometimes|exists:organisateurs,id_organisateur',
            'tickets'                        => 'sometimes|array|min:1',
            'tickets.*.id_type_ticket' => 'sometimes|exists:types_tickets,id_type_ticket',
            'tickets.*.libelle'              => 'required_with:tickets|string|max:255',
            'tickets.*.prix_ticket'          => 'required_with:tickets|numeric|min:0',
            'tickets.*.quantite_type_ticket' => 'required_with:tickets|integer|min:1',
        ];
    }
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Erreur de validation',
            'errors' => $validator->errors()
        ], 422));
    }
}
