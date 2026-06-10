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
    public function rules(): array
    {
        return [
            'nom'                      => 'sometimes|string|max:255',
            'date'                     => 'sometimes|date',
            'description'              => 'sometimes|string',
            'image'                    => 'sometimes|image|mimes:jpeg,png,jpg|max:2048',
            'id_categorie'             => 'sometimes|exists:categories,id_categorie',
            'id_lieu'             => 'sometimes|exists:lieux,id_lieu',
            'id_organisateur'             => 'sometimes|exists:organisateurs,id_organisateur',

            // 'types_tickets'   => 'sometimes|array|size:2',
            'id_type_ticket'   => 'sometimes|exists:types_tickets,id_type_ticket',
            'total_ticket_evenement' => 'sometimes|integer|min:1',
            'quantite_type_ticket'  => 'sometimes|integer|min:1',
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
