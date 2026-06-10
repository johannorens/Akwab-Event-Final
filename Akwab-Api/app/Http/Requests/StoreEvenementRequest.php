<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;

class StoreEvenementRequest extends FormRequest
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
            'nom'                      => 'required|string|max:255',
            'date'                     => 'required|date',
            'description'              => 'required|string',
            'image'                    => 'required|image|mimes:jpeg,png,jpg|max:2048',
            'id_categorie'             => 'required|exists:categories,id_categorie',
            'id_lieu'             => 'required|exists:lieux,id_lieu',
            'id_organisateur'             => 'required|exists:organisateurs,id_organisateur',

            // 'types_tickets'   => 'required|array|size:2',
            'id_type_ticket'   => 'required|exists:types_tickets,id_type_ticket',
            'total_ticket_evenement' => 'required|integer|min:1',
            'quantite_type_ticket'  => 'required|integer|min:1',
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
