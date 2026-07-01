import { API_URL } from "../../config/api";

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import HeaderLayout from "../HeaderLayout"
import arrow from "../../assets/icones/Arrowleft.svg"
import jsPDF from "jspdf"
import logo from "../../assets/Image/logo.png"

function DetailTicket() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lignes, setLignes] = useState([]);

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch(
                    `${API_URL}/api/tickets/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: "application/json",
                        },
                    }
                );

                const data = await response.json();
                setTicket(data.data);
                const saved = localStorage.getItem(`ticket_lignes_${data.data.id}`);
                if (saved) setLignes(JSON.parse(saved));


            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchTicket();
    }, [id]);

    const handleDownload = async () => {
        try {
            const pdf = new jsPDF("p", "mm", "a4");

            pdf.addImage(logo, "PNG", 15, 10, 30, 30);

            pdf.setFontSize(22);
            pdf.setTextColor(37, 60, 150);
            pdf.text("AKWAB EVENT", 55, 25);

            pdf.setFontSize(12);
            pdf.setTextColor(25, 36, 78);
            pdf.text("Billet d'accès à l'évènement", 55, 33);
            pdf.setDrawColor(243, 107, 46);
            pdf.line(10, 45, 200, 45);

            pdf.setFontSize(18);
            pdf.setTextColor(77, 2, 122);
            pdf.text(ticket.evenement.nom, 15, 60);

            pdf.setFontSize(12);
            pdf.setTextColor(0);

            pdf.text(`Numéro : ${ticket.numero_ticket}`, 15, 75);

            let y = 90;

            if (lignes.length > 0) {
                lignes.forEach(ligne => {
                    pdf.text(`${ligne.libelle} x${ligne.quantite}`, 15, y);
                    y += 10; 
                });
            } else {
                pdf.text(`Type : ${ticket.type_ticket?.libelle}`, 15, y);
                y += 10;
                pdf.text(`Quantité : ${ticket.nombre_ticket_pris}`, 15, y);
                y += 10;
            }

            y += 5; 

            const montant = Number(ticket.prix_total)
                .toLocaleString("fr-FR")
                .replace(/\s/g, ".");

            pdf.text(`Montant : ${montant} FCFA`, 15, y);
            y += 10;

            pdf.text(`Date réservation : ${ticket.date_reservation}`, 15, y);
            y += 10;

            pdf.text(`Date évènement : ${ticket.evenement.date}`, 15, y);
            y += 10;

            pdf.text(`Lieu : ${ticket.evenement.lieux.nom}`, 15, y);
            y += 10;

            pdf.text(`Ville : ${ticket.evenement.lieux.ville}`, 15, y);
            y += 10;

            pdf.text(`Organisateur : ${ticket.evenement.organisateurs.nom}`, 15, y);
            y += 10;


            const rectHeight = y - 45;
            pdf.setDrawColor(37, 60, 150);
            pdf.roundedRect(10, 50, 190, rectHeight, 3, 3);

            pdf.save(`Ticket-${ticket.numero_ticket}.pdf`);


        } catch (error) {
            console.error(error);
        }
    };

    if (loading) {
        return (
            <HeaderLayout>
                <div className="p-6 animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/2 mb-6"></div>
                    <div className="h-64 bg-gray-200 rounded-xl"></div>
                </div>
            </HeaderLayout>
        );
    }

    if (!ticket) {
        return (
            <HeaderLayout>
                <div className="flex justify-center items-center h-[60vh]">
                    <p className="text-gray-500">Ticket introuvable</p>
                </div>
            </HeaderLayout>
        );
    }


    return (
        <HeaderLayout>
            <section data-cy="ticket-card" className="mb-6 mx-auto px-4">

                <div className="flex items-center lg:ml-[-200px] mb-3 pt-[50px]">
                    <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100">
                        <img src={arrow} alt="retour" className="w-5 h-5" />
                    </button>
                    <h1 className="text-2xl font-bold text-[#253C96]">
                        Mon ticket
                    </h1>
                </div>

                <div className="bg-white sm:w-xl w-full max-w-md rounded-2xl shadow-lg overflow-hidden border border-[#F59A1E]">

                    <div className="h-52">
                        <img
                            src={ticket.evenement?.image}
                            alt={ticket.evenement?.nom}
                            className="w-full h-full object-cover border border-[#F59A1E]"
                        />
                    </div>

                    <div className="p-5">

                        <h2 className="text-xl font-bold text-[#F36B2E] mb-2">
                            {ticket.evenement?.nom}
                        </h2>

                        <div className="space-y-3">

                            <div className="flex justify-between">
                                <span className="text-gray-500">N° ticket</span>
                                <span className="font-semibold text-md">
                                    {ticket.numero_ticket}
                                </span>
                            </div>

                            {/* <div className="flex justify-between">
                                <span className="text-gray-500">Type</span>
                                <span className="font-semibold text-md">
                                    {ticket.type_ticket?.libelle}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-500">Quantité</span>
                                <span className="font-semibold text-md">
                                    {ticket.nombre_ticket_pris}
                                </span>
                            </div> */}

                            {lignes.length > 0 ? (
                                lignes.map((ligne, index) => (
                                    <div key={index} className="flex justify-between">
                                        <span className="text-gray-500">{ligne.libelle}</span>
                                        <span className="font-semibold text-md">
                                            {ligne.quantite} x {(ligne.quantite * parseFloat(ligne.prix)).toLocaleString()} F CFA
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Type</span>
                                        <span className="font-semibold text-md">{ticket.type_ticket?.libelle}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Quantité</span>
                                        <span className="font-semibold text-md">{ticket.nombre_ticket_pris}</span>
                                    </div>
                                </>
                            )}


                            <div className="flex justify-between">
                                <span className="text-gray-500">Date de réservation</span>
                                <span className="font-semibold text-md">
                                    {ticket.date_reservation}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-500">Date l'événement</span>
                                <span className="font-semibold text-md">
                                    {ticket.evenement?.date}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-500">Lieu</span>
                                <span className="font-semibold text-md text-right">
                                    {ticket.evenement?.lieux?.ville} - {ticket.evenement?.lieux?.nom}

                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-500">Organisateur</span>
                                <span className="font-semibold text-md">
                                    {ticket.evenement?.organisateurs?.nom}
                                </span>
                            </div>

                            <div className="flex justify-between border-t border-gray-200 pt-3">
                                <span className="text-gray-500">Somme payé</span>
                                <span className="font-bold text-[#253C96]">
                                    {parseFloat(ticket.prix_total || 0).toLocaleString()} F CFA
                                </span>
                            </div>

                        </div>

                    </div>

                </div>

                <div id="donnees" className="flex justify-center lg:justify-end mb-4 items-center mt-5">

                    <button data-cy="btn-download-ticket" onClick={handleDownload} className="px-4 py-2 rounded-sm text-[12px] text-end font-semibold bg-[#253C96] text-white hover:bg-[#D6ABEB] transition-all">
                        Télécharger mon ticket
                    </button>
                </div>
            </section>
        </HeaderLayout>
    );
}

export default DetailTicket;