import { API_URL } from "../../config/api";
import arrow from "../../assets/icones/Arrowleft.svg"
import { useNavigate, useParams } from "react-router-dom"
import HeaderLayout from "../HeaderLayout"
import Swal from "sweetalert2"
import { useEffect, useState } from "react"
import logo from "../../assets/Image/logo.png"
import { useLikes } from "../../Context/useLikes"
import heart from "../../assets/icones/favoris.svg"
import heartFull from "../../assets/icones/Vector.svg"
import description from "../../assets/icones/description1.svg"
import locationIcon from "../../assets/icones/location_on.svg"
import dateIcon from "../../assets/icones/date-vert.svg"
import userIcon from "../../assets/icones/User.svg"


function DetailEvenement() {

    const navigate = useNavigate();
    const [evenement, setEvenement] = useState(null);
    const { id } = useParams();
    const [quantites, setQuantites] = useState({});
    const [loading, setLoading] = useState(true);
    const { estLike, toggleLike } = useLikes();
    const [showRecap, setShowRecap] = useState(false);



    useEffect(() => {
        const fetchEvenement = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch(`${API_URL}/api/evenements/${id}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    },
                }
                );
                const data = await response.json();
                console.log("types_tickets:", data.data?.types_tickets);
                setEvenement(data.data);


                const init = {};
                (data.data?.types_tickets || []).forEach(t => {
                    init[t.id_type_ticket] = 0;
                });
                setQuantites(init);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvenement();
    }, [id]);

    const handleLike = async () => {
        if (!localStorage.getItem("token")) {
            Swal.fire({
                text: "Connectez-vous pour aimer cet événement",
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
        await toggleLike(evenement.id_evenement);
    };

    const incrementer = (idType, max) => {
        setQuantites(prev => {
            const actuel = prev[idType] || 0;
            if (actuel >= max) return prev;
            const nouveau = { ...prev, [idType]: actuel + 1 };
            setShowRecap(Object.values(nouveau).some(q => q > 0));
            return nouveau;
        });
    };

    const decrementer = (idType) => {
        setQuantites(prev => {
            const actuel = prev[idType] || 0;
            if (actuel <= 0) return prev;
            const nouveau = { ...prev, [idType]: actuel - 1 };
            setShowRecap(Object.values(nouveau).some(q => q > 0));
            return nouveau;
        });
    };

    const allerAuPaiement = () => {
        if (!localStorage.getItem("token")) {
            Swal.fire({
                text: "Connectez-vous pour réserver",
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
        navigate("/paiement", {
            state: { evenement, quantites }
        });
    };

    
    const calculerTotal = () => {
        if (!evenement) return 0;
        return (evenement.types_tickets || []).reduce((total, type) => {
            const qte = quantites[type.id_type_ticket] || 0;
            const prix = parseFloat(type.prix_ticket) || 0;
            return total + (qte * prix);
        }, 0);
    };

    
    const lignesRecap = (evenement?.types_tickets || []).filter(
        t => (quantites[t.id_type_ticket] || 0) > 0
    );

    const liked = estLike(evenement?.id_evenement);


    if (loading) {
        return (
            <HeaderLayout>
                <p className="text-center mt-10">Chargement...</p>
            </HeaderLayout>
        );
    }

    if (!evenement) {
        return (
            <HeaderLayout>
                <p className="text-center mt-10 text-red-500">
                    Événement introuvable
                </p>
            </HeaderLayout>
        );
    }


    return (
        <HeaderLayout>

            <section className="mb-6 bg-gray-50 max-w-4xl mx-auto px-5 py-5 w-full">

                <div className="flex items-center mb-3 pt-[50px]">

                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-full hover:bg-gray-200 transition">
                        <img src={arrow} alt="fleche-sortie" />
                    </button>
                    <h2
                        id="titre"
                        className="text-[24px] font-bold text-[#253C96]"
                    >
                        Détail de l'évènement
                    </h2>
                </div>

                {loading && (
                    <div className="w-full max-w-lg px-4 pt-10 animate-pulse">
                        <div className="h-5 bg-gray-200 rounded w-1/2 mb-6" />
                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
                        <div className="space-y-3 mb-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-4 bg-gray-200 rounded w-2/3" />
                            ))}
                        </div>
                        <div className="h-48 bg-gray-200 rounded-xl mb-4" />
                    </div>
                )}



                <div className="flex items-start justify-between mt-5 mb-1">
                    <h1 className="text-xl font-bold text-[#F36B2E] uppercase flex-1 pr-4">
                        {evenement.nom}
                    </h1>
                    <button onClick={handleLike} className="shrink-0 mt-6">
                        <img src={liked ? heartFull : heart} alt="like" className="w-6 h-6" />
                    </button>
                </div>


                <div className="border-b border-1 mt-2 border-gray-400 mb-4" />


                <div className="space-y-5 mb-4 text-lg">
                    <div className="flex items-center gap-2 text-gray-600">
                        <img src={description} alt="description" className="w-5 h-5" />
                        <p>{evenement.description}</p>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                        <img src={dateIcon} alt="date" className="w-6 h-6" />
                        <p>{evenement.date}</p>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                        <img src={locationIcon} alt="localisation" className="w-6 h-6" />
                        <p>
                            {evenement.lieux?.ville} - {evenement.lieux?.nom}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                        <img src={userIcon} alt="organisateur" className="w-6 h-6" />
                        <p>Organisé par
                            <span className="font-bold">
                                @{evenement.organisateurs?.nom}
                            </span>
                        </p>
                        <button className="ml-1 px-3 py-0.5 bg-[#F36B2E] text-gray-100 text-xs font-semibold rounded-full">
                            S'abonner
                        </button>
                    </div>
                </div>


                <div className="rounded-xl overflow-hidden mb-5 h-48">
                    <img src={evenement.image} alt={evenement.nom} className="w-full h-full object-cover" />
                </div>


                <div className="bg-[#EDE0CE] text-center text-sm p-2 text-gray-700 mb-0">
                    CHOISISSEZ VOS TICKETS
                </div>


                <div className="flex flex-col lg:flex-row gap-4 items-start">
                    <div className="w-full lg:w-1/2 border border-[#253C96] mt-10 bg-gray-100 overflow-hidden">
                        {(evenement.types_tickets || []).map((type, index) => {
                            const qte = quantites[type.id_type_ticket] || 0;
                            const restant = type.quantite_ticket_restante
                                ?? type.pivot?.quantite_ticket_restante
                                ?? 0;

                            return (
                                <div
                                    key={type.id_type_ticket}
                                    className={`p-4 flex items-center justify-between
                                            ${index > 0 ? "border-t border-[#253C96]" : ""}`}
                                >
                                    <div>
                                        <p className="font-bold text-sm text-[#253C96]">
                                            {type.libelle}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {parseFloat(type.prix_ticket).toLocaleString()}F CFA
                                        </p>
                                        {restant <= 10 && restant > 0 && (
                                            <p className="text-[10px] text-red-400">
                                                Plus que {restant} places !
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => decrementer(type.id_type_ticket)}
                                            className="w-7 h-7 rounded border border-[#253C96]
                                                text-[#253C96] font-bold text-lg
                                                flex items-center justify-center
                                                hover:bg-[#253C96] hover:text-white
                                                transition-colors"
                                        >
                                            -
                                        </button>
                                        <span className="w-6 text-center font-semibold text-sm">
                                            {qte}
                                        </span>
                                        <button data-cy="btn-increment"
                                            onClick={() => incrementer(type.id_type_ticket, restant)}
                                            className="w-7 h-7 rounded border border-[#253C96]
                                                text-[#253C96] font-bold text-lg
                                                flex items-center justify-center
                                                hover:bg-[#253C96] hover:text-white
                                                transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div> 
                            );
                        })}
                    </div>


                    {showRecap && (
                        <div className="w-full lg:w-1/2 mb-5 mt-10 border border-[#253C96] bg-gray-100 p-4 self-start">
                            <p className="font-bold text-sm text-[#1E1B2E] mb-3">
                                Votre commande
                            </p>

                            {lignesRecap.map(type => (
                                <div key={type.id_type_ticket}
                                    className="flex justify-between text-sm mb-1">
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

                            <div className="border-t border-gray-200 mt-2 pt-2
                                        flex justify-between text-sm font-bold">
                                <span>Total</span>
                                <span>{calculerTotal().toLocaleString()}F</span>
                            </div>

                            <button data-cy="btn-paiement"
                                onClick={allerAuPaiement}
                                className="w-full mt-4 py-3 bg-[#253C96] text-white
                                    font-bold text-sm rounded-xl
                                    hover:bg-[#19244E] transition-colors"
                            >
                                Aller au paiement
                            </button>
                        </div>
                    )}
                </div>

            </section>
        </HeaderLayout>
    )
}
export default DetailEvenement;

