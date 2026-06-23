

import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import HeaderLayout from "../HeaderLayout"
import Swal from "sweetalert2"
import arrow from "../../assets/icones/Arrowleft.svg"
import wave from "../../assets/Image/wave.jpg"
import om from "../../assets/Image/om.png"
import visa from "../../assets/Image/visa.webp"



function Paiement() {
    const navigate = useNavigate();
    const location = useLocation();
    const { evenement, quantites } = location.state || {}; "'"
    const [loading, setLoading] = useState(false);


    if (!evenement || !quantites) {
        navigate("/accueil");
        return null;
    }

    const lignes = (evenement.types_tickets || []).filter(
        t => (quantites[t.id_type_ticket] || 0) > 0
    );

    const total = lignes.reduce((sum, t) => {
        return sum + (quantites[t.id_type_ticket] * parseFloat(t.prix_ticket));
    }, 0);


    const handlePaiement = async () => {
        setLoading(true);
        const token = localStorage.getItem("token");

        try {

            const response = await fetch(
                "http://127.0.0.1:8000/api/tickets",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id_evenement: evenement.id_evenement,
                        tickets: lignes.map(type => ({
                            id_type_ticket: type.id_type_ticket,
                            nombre_ticket_pris:
                                quantites[type.id_type_ticket],
                        })),
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Erreur serveur");
            }

            await Swal.fire({
                icon: "success",
                title: "Paiement confirmé !",
                text: "Vous allez recevoir votre ticket par email. Consultez votre boîte mail.",
                confirmButtonColor: "#4D027A",
                confirmButtonText: "Voir mon ticket",
            });


            navigate(`/ticket/${data.data.id}`);

        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: "error",
                title: "Erreur",
                text: "Une erreur est survenue. Veuillez réessayer.",
                confirmButtonColor: "#4D027A",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <HeaderLayout>
            <div className="w-full mx-auto max-w-lg px-4 pt-6 pb-24">

                <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-200 transition">
                    <img src={arrow} alt="fleche-sortie" />
                </button>

                <div className="bg-[#4D027A]/25 py-2 text-center text-sm font-bold text-[#4D027A] mb-5">
                    PAIEMENT
                </div>

                <div className="border border-gray-300 bg-gray-100 rounded-sm mb-5">

                    <div className="border-b border-gray-300 px-4 py-2">
                        <p className="text-sm font-medium">
                            Votre commande
                        </p>
                    </div>

                    {lignes.map(type => (
                        <div key={type.id_type_ticket}
                            className="flex justify-between px-4 py-2 border-b border-gray-200 text-sm">
                            <span>
                                {quantites[type.id_type_ticket]}x {type.libelle}
                            </span>
                            <span className="font-semibold">
                                {(
                                    quantites[type.id_type_ticket] *
                                    parseFloat(type.prix_ticket)
                                ).toLocaleString()}F
                            </span>
                        </div>
                    ))}

                    <div className="flex justify-between px-4 py-2 border-b border-gray-300 text-sm font-bold">
                        <span>Total</span>
                        <span>{total.toLocaleString()}F</span>
                    </div>

                    <div className="px-4 py-2">
                        <p className="text-[11px] text-gray-400">Evènement</p>
                        <p className="text-sm font-bold text-[#1E1B2E] uppercase">
                            {evenement.nom}
                        </p>
                    </div>
                </div>


                <div className="border border-gray-300 bg-gray-100 rounded-sm mb-6">
                    <div className="bg-[#4D027A]/25 py-2 text-center text-sm font-bold text-[#4D027A]">
                        METHODES DE PAIEMENT
                    </div>

                    <div className="p-4 space-y-3">


                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="radio" name="paiement" value="wave" defaultChecked className="accent-[#4D027A]" />
                            <div className="flex items-center gap-2">
                                <img src={wave} alt="wave" className="w-10 h-10" />
                                <p className="text-sm font-medium">Wave</p>
                            </div>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="radio" name="paiement" value="orange" className="accent-[#4D027A]" />
                            <div className="flex items-center gap-2">
                                <img src={om} alt="om" className="w-10 h-10" />
                                <span className="text-sm font-medium">Orange Money</span>
                            </div>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="radio" name="paiement" value="visa" className="accent-[#4D027A]" />
                            <div className="flex items-center gap-2">
                                <img src={visa} alt="Carte virtuelle" className="w-10 h-10" />
                                <span className="text-sm font-medium">Carte Virtuelle</span>
                            </div>
                        </label>
                    </div>
                </div>

                <div className="text-center text-xs text-gray-400 mb-6 px-4">
                    <p>Vous allez recevoir votre billet par email.</p>
                    <p>Consultez votre boîte mail après le paiement.</p>
                </div>


                <button onClick={handlePaiement} disabled={loading} className="w-full py-3 bg-[#4D027A] text-white font-bold text-sm rounded-xl hover:bg-[#3a0260] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading ? "Traitement en cours..." : `Payer ${total.toLocaleString()}F`}
                </button>
            </div>
        </HeaderLayout>
    );
}

export default Paiement;