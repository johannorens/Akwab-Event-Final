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
            // 'date_reservation' => 'required|date',
            'id_evenement'     => 'required|exists:evenements,id_evenement',
            'tickets'          => 'required|array|min:1',
            'tickets.*.id_type_ticket'     => 'required|exists:types_tickets,id_type_ticket',
            'tickets.*.nombre_ticket_pris' => 'required|integer|min:1',
        ];
    }
}
