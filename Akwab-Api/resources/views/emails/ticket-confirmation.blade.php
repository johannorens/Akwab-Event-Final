<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmation de ticket</title>
</head>

<body style="margin:0; padding:0; background-color:#f4f4f4; font-family: Arial, sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4; padding: 40px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0"
                    style="background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">

                    <tr>
                        <td style="background-color:#4D027A; padding: 30px 40px; text-align:center;">
                            <h1 style="color:#ffffff; margin:0; font-size:24px; letter-spacing:1px;">
                                AKWAB'EVENT
                            </h1>
                            <p style="color:#e0b3ff; margin:8px 0 0; font-size:14px;">
                                Confirmation de billet !
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 40px;">

                            <p style="color:#333; font-size:16px; margin:0 0 20px;">
                                Bonjour <strong>{{ $ticket->utilisateur->prenoms ?? '' }}
                                    {{ $ticket->utilisateur->nom ?? '' }}</strong>,
                            </p>
                            <p style="color:#555; font-size:14px; line-height:1.6; margin:0 0 30px;">
                                Merci pour votre achat ! Votre paiement a bien été reçu et votre ticket est confirmé.
                            </p>

                            <table width="100%" cellpadding="0" cellspacing="0"
                                style="background-color:#f9f0ff; border:1px solid #e0b3ff; border-radius:10px; margin-bottom:30px;">
                                <tr>
                                    <td style="padding:25px 30px;">
                                        <p
                                            style="margin:0 0 5px; font-size:11px; color:#9952DE; font-weight:bold; text-transform:uppercase; letter-spacing:1px;">
                                            Numéro de ticket
                                        </p>
                                        <p style="margin:0 0 20px; font-size:20px; font-weight:bold; color:#4D027A;">
                                            {{ $ticket->numero_ticket }}
                                        </p>

                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="padding:8px 0; border-bottom:1px solid #e8d5f5;">
                                                    <span style="color:#888; font-size:13px;">Événement</span>
                                                </td>
                                                <td
                                                    style="padding:8px 0; border-bottom:1px solid #e8d5f5; text-align:right;">
                                                    <strong
                                                        style="color:#333; font-size:13px;">{{ $ticket->evenements->nom ?? '' }}</strong>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding:8px 0; border-bottom:1px solid #e8d5f5;">
                                                    <span style="color:#888; font-size:13px;">Nombre de tickets</span>
                                                </td>
                                                <td
                                                    style="padding:8px 0; border-bottom:1px solid #e8d5f5; text-align:right;">
                                                    <strong
                                                        style="color:#333; font-size:13px;">{{ $ticket->nombre_ticket_pris }}</strong>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding:8px 0; border-bottom:1px solid #e8d5f5;">
                                                    <span style="color:#888; font-size:13px;">Date de réservation</span>
                                                </td>
                                                <td
                                                    style="padding:8px 0; border-bottom:1px solid #e8d5f5; text-align:right;">
                                                    <strong style="color:#333; font-size:13px;">
                                                        {{ \Carbon\Carbon::parse($ticket->date_reservation)->format('d/m/Y à H:i') }}
                                                    </strong>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding:12px 0 0;">
                                                    <span style="color:#888; font-size:13px;">Montant total</span>
                                                </td>
                                                <td style="padding:12px 0 0; text-align:right;">
                                                    <strong style="color:#4D027A; font-size:18px;">
                                                        {{ number_format($ticket->prix_total, 0, ',', ' ') }} FCFA
                                                    </strong>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <p style="color:#555; font-size:13px; line-height:1.6; margin:0 0 10px;">
                                Présentez ce numéro de ticket à l'entrée de l'événement.
                            </p>
                            <p style="color:#555; font-size:13px; line-height:1.6; margin:0;">
                                Conservez cet email comme preuve d'achat.
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td
                            style="background-color:#f9f0ff; padding:20px 40px; text-align:center; border-top:1px solid #e8d5f5;">
                            <p style="color:#9952DE; font-size:12px; margin:0;">
                                © {{ date('Y') }} Akwab'Event — Tous droits réservés
                            </p>
                            <p style="color:#bbb; font-size:11px; margin:6px 0 0;">
                                Vous recevez cet email car vous avez effectué un achat sur notre plateforme.
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>

</body>

</html>
