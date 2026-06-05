<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreTicketRequest extends FormRequest
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
            'numero_ticket'      => 'required|string|max:255|unique:tickets,numero_ticket',
            'prix_total'         => 'required|numeric|min:0',
            'date_reservation'   => 'required|date',
            'nombre_ticket_pris' => 'required|integer|min:1',
            'id_utilisateurs'    => 'required|exists:utilisateurs,id_utilisateurs',
            'id_evenement'       => 'required|exists:evenements,id_evenement',
            'id_type_ticket'     => 'required|exists:type_tickets,id_type_ticket',
        ];
    }
}
