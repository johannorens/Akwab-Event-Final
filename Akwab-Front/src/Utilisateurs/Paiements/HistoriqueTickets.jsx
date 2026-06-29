

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import HeaderLayout from "../HeaderLayout"
import search from "../../assets/icones/icons8-search.svg"
import arrow from "../../assets/icones/Arrowleft.svg"
import dateIcon from "../../assets/icones/date-vert.svg"
import locationIcon from "../../assets/icones/location_on.svg"
import Swal from "sweetalert2";
import logo from "../../assets/Image/logo.png"
import billet from "../../assets/icones/billet-bleu.svg"
import monnaie from "../../assets/icones/prix-vert.svg"
import hashtag from "../../assets/icones/hashtag-bleu.svg"
import jsPDF from "jspdf"

function HistoriqueTicket() {
    const navigate = useNavigate();
    const [recherche, setRecherche] = useState("");
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);


    const handleChange = (e) => setRecherche(e.target.value);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            Swal.fire({
                text: "Connectez-vous pour voir votre historique",
                imageUrl: logo,
                imageWidth: 150,
                showConfirmButton: true,
                showDenyButton: true,
                confirmButtonText: "S'inscrire",
                denyButtonText: "Se connecter",
                confirmButtonColor: "#10D4CF",
                denyButtonColor: "#10D4CF",
            }).then(result => {
                if (result.isConfirmed) navigate("/register");
                if (result.isDenied) navigate("/login");
            });
            return;
        }

        const fetchTickets = async () => {
            setLoading(true);

            try {
                const response = await fetch(
                    "http://127.0.0.1:8000/api/mes-tickets",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: "application/json",
                        },
                    }
                );
                const data = await response.json();
                setTickets(data.data || []);


            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, [navigate]);


    const handleDownload = async (ticket) => {
        try {
            const saved = localStorage.getItem(`ticket_lignes_${ticket.id}`);
            const lignes = saved ? JSON.parse(saved) : [];

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


    const ticketsFiltres = tickets.filter(t => {
        const texte = recherche.toLowerCase();
        return (
            t.evenement?.nom?.toLowerCase().includes(texte) ||
            t.evenement?.lieux?.ville?.toLowerCase().includes(texte)
        );
    });

    return (
        <HeaderLayout>
            <section className="mb-6 px-4 w-full">


                <div className="flex items-center mb-3 pt-[50px]">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-full hover:bg-gray-200 transition">
                        <img src={arrow} alt="fleche-sortie" />
                    </button>
                    <h2 id="titre" className="text-[24px] font-bold text-[#253C96]">
                        Historique des tickets
                    </h2>
                </div>


                <div className="flex items-center gap-2 mt-6">
                    <div className="flex-1 flex items-center gap-2 bg-white rounded-xl px-3 py-2.5 shadow-sm">
                        <input type="text" value={recherche} onChange={handleChange} placeholder="Recherche..." className="bg-transparent text-sm text-[#1E1B2E] placeholder-gray-400 outline-none w-full" />
                    </div>
                    <button className="bg-[#C4E7E5] p-3 rounded-xl shadow-sm shrink-0">
                        <img src={search} alt="search-icon" className="w-4 h-4 text-white" />
                    </button>
                </div>


                {loading && (
                    <div className="space-y-6 mt-10">
                        {[1, 2].map(i => (
                            <div key={i} className="bg-gray-50 p-6 rounded-xl animate-pulse">
                                <div className="flex gap-4">
                                    <div className="w-28 h-20 bg-gray-200 rounded" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-2/3" />
                                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                                        <div className="h-3 bg-gray-200 rounded w-1/3" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}


                {!loading && ticketsFiltres.length === 0 && (
                    <div className="flex flex-col items-center justify-center mt-20 text-center">
                        <p className="text-gray-500 font-medium text-sm">
                            {recherche ? "Aucun résultat trouvé" : "Aucun ticket pour le moment"}
                        </p>
                    </div>
                )}



                {!loading && ticketsFiltres.length > 0 && (
                    <div className="space-y-6 mt-10 mb-10">
                        {ticketsFiltres.map(ticket => (
                            <div data-cy="ticket-card" key={ticket.id}
                                className="bg-gray-50 p-4 sm:p-6 w-full max-w-xl rounded-xl">

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="w-full sm:w-1/4">
                                        <img src={ticket.evenement?.image} alt="image-event" className="w-full sm:w-28 h-32 sm:h-20 object-cover rounded" />
                                    </div>
                                    <div className="w-full sm:w-3/4">
                                        <h3 className="mb-2 font-bold uppercase text-[#F36B2E] text-sm sm:text-base">
                                            {ticket.evenement?.nom}
                                        </h3>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <img src={dateIcon} alt="date" className="w-5 h-5 shrink-0" />
                                            <p className="text-sm">{ticket.evenement?.date}</p>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <img src={locationIcon} alt="localisation" className="w-5 h-5 shrink-0" />
                                            <p className="text-sm">
                                                {ticket.evenement?.lieux?.ville} - {ticket.evenement?.lieux?.nom}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-b border-gray-400 mt-2 mb-4 w-full" />


                                <div className="flex flex-wrap gap-x-10 gap-y-1">
                                    {(() => {
                                        const saved = localStorage.getItem(`ticket_lignes_${ticket.id}`);
                                        const lignes = saved ? JSON.parse(saved) : [];
                                        return lignes.length > 0
                                            ? lignes.map((l, i) => (
                                                <div key={i} className="flex items-center gap-1">
                                                    <img src={billet} alt="icone-ticket" className="w-5 h-5 shrink-0" />
                                                    <p className="text-sm font-semibold">{l.libelle} x{l.quantite}</p>
                                                </div>
                                            ))
                                            : (
                                                <div className="flex items-center gap-1">
                                                    <img src={billet} alt="icone-ticket" className="w-5 h-5 shrink-0" />
                                                    <p className="text-sm font-semibold">{ticket.type_ticket?.libelle} x {ticket.nombre_ticket_pris}</p>
                                                </div>
                                            );
                                    })()}
                                </div>

                                <div className="flex items-center mt-5">
                                    <img src={hashtag} alt="icone-hashtag" className="w-5 h-5 shrink-0" />
                                    <p className="text-sm font-semibold ml-1 break-all">
                                        {ticket.numero_ticket}
                                    </p>
                                </div>

                                <div className="flex items-center mt-2">
                                    <img src={monnaie} alt="icone-monnaie" className="w-5 h-5 shrink-0" />
                                    <p className="text-sm font-semibold ml-1">
                                        {parseFloat(ticket.prix_total).toLocaleString()} F CFA
                                    </p>
                                </div>


                                <div className="flex flex-col sm:flex-row justify-between gap-2 mt-5">
                                    <button onClick={() => navigate(`/ticket/${ticket.id}`)} className="px-4 py-2 rounded-sm text-[12px] font-semibold bg-[#F36B2E] text-white hover:bg-[#D6ABEB] transition-all w-full sm:w-auto">
                                        Voir mon ticket
                                    </button>

                                    <button onClick={() => handleDownload(ticket)} className="px-4 py-2 rounded-sm text-[12px] font-semibold bg-[#F36B2E] text-white hover:bg-[#D6ABEB] transition-all w-full sm:w-auto">
                                        Télécharger mon ticket
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </HeaderLayout>
    );
}

export default HistoriqueTicket;