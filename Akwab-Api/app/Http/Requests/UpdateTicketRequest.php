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
            'tickets'                      => 'sometimes|array|min:1',
            'tickets.*.id_type_ticket'     => 'required_with:tickets|exists:type_tickets,id_type_ticket',
            'tickets.*.nombre_ticket_pris' => 'required_with:tickets|integer|min:1',
            'id_evenement'                 => 'sometimes|exists:evenements,id_evenement',
        ];
    }
}
