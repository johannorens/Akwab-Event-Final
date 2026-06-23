
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import locationIcon from "../../assets/icones/location_on.svg";
import search from "../../assets/icones/icons8-search.svg";
import useGeolocation from "./Usegeolocation";
import PopupLocalisation from "./Popuplocalisation";

function TopBar() {
    const navigate = useNavigate();
    const { localisation, showPopup, demanderPosition, refuserPosition } = useGeolocation();

    const [recherche, setRecherche] = useState("");
    const [resultats, setResultats] = useState([]);
    const [showResultats, setShowResultats] = useState(false);
    const [loading, setLoading] = useState(false);
    const timeoutRef = useRef(null);

    const handleChange = (e) => {
        const valeur = e.target.value;
        setRecherche(valeur);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        if (valeur.trim().length < 2) {
            setResultats([]);
            setShowResultats(false);
            return;
        }

        timeoutRef.current = setTimeout(() => {
            rechercherEvenements(valeur);
        }, 400);
    };

    const rechercherEvenements = async (texte) => {
        setLoading(true);
        try {
            const response = await fetch(
                "http://127.0.0.1:8000/api/evenements",
                { headers: { Accept: "application/json" } }
            );
            const data = await response.json();

            const filtres = (data.data || []).filter(ev =>
                ev.nom?.toLowerCase().includes(texte.toLowerCase()) ||
                ev.lieux?.ville?.toLowerCase().includes(texte.toLowerCase()) ||
                ev.categories?.libelle?.toLowerCase().includes(texte.toLowerCase())
            );

            setResultats(filtres);
            setShowResultats(true);
        } catch (err) {
            console.error("Erreur recherche:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectionner = (id) => {
        setShowResultats(false);
        setRecherche("");
        navigate(`/evenements/${id}`);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest("#zone-recherche")) {
                setShowResultats(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    return (
        <>
            <PopupLocalisation
                visible={showPopup}
                onAccepter={demanderPosition}
                onRefuser={refuserPosition}
            />

            <div className="w-full flex flex-col px-4 py-2 text-start relative">

                <div className="mt-4">
                    <p id="localisation" className="text-sm">Localisation</p>
                    <div className="flex items-center">
                        <img src={locationIcon} alt="icone_localisation" className="w-[30px]" />
                        <p id="localisation2">{localisation}</p>
                    </div>
                </div>


                <div id="zone-recherche" className="flex items-center gap-2 mt-3 relative">
                    <div className="flex-1 flex items-center gap-2 bg-white rounded-xl px-3 py-2.5 shadow-sm">
                        <input type="text" value={recherche} onChange={handleChange}
                            onFocus={() => recherche.length >= 2 && setShowResultats(true)}
                            placeholder="Recherche..." className="bg-transparent text-sm text-[#1E1B2E] placeholder-gray-400 outline-none w-full" />
                    </div>

                    <button onClick={() => recherche.trim() && rechercherEvenements(recherche)} className="bg-[#D6ABEB] p-3 rounded-xl shadow-sm shrink-0">
                        <img src={search} alt="search-icon" className="w-4 h-4" />
                    </button>

                    {showResultats && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 max-h-80 overflow-y-auto z-30">

                            {loading && (
                                <p className="text-sm text-gray-400 text-center py-4">
                                    Recherche en cours...
                                </p>
                            )}

                            {!loading && resultats.length === 0 && (
                                <p className="text-sm text-gray-400 text-center py-4">
                                    Aucun résultat pour "{recherche}"
                                </p>
                            )}

                            {!loading && resultats.map(ev => (
                                <button
                                    key={ev.id_evenement}
                                    onClick={() => handleSelectionner(ev.id_evenement)}
                                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 text-left">
                                    <img src={ev.image} alt={ev.nom} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-[#1E1B2E] truncate">
                                            {ev.nom}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {ev.lieux?.ville} · {ev.date}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default TopBar;

