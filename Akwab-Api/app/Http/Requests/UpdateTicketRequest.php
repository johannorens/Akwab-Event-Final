<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateTicketRequest extends FormRequest
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
            'numero_ticket'      => 'sometimes|string|max:255|unique:tickets,numero_ticket,' . $this->ticket . ',id_ticket',
            'prix_total'         => 'sometimes|numeric|min:0',
            'date_reservation'   => 'sometimes|date',
            'nombre_ticket_pris' => 'sometimes|integer|min:1',
            'id_utilisateurs'    => 'sometimes|exists:utilisateurs,id_utilisateurs',
            'id_evenement'       => 'sometimes|exists:evenements,id_evenement',
            'id_type_ticket'     => 'sometimes|exists:type_tickets,id_type_ticket',
        ];
    }
}
