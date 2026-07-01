import { API_URL } from "../../config/api";
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import CardEvenement from "./CardEvenement"

function ListeEvenement({ filtreCategorie }) {
    const [evenements, setEvenements] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchEvenements = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch(API_URL + "/api/evenements", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    },
                });

                const data = await response.json();

                setEvenements(data.data || data || []);

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEvenements();
    }, []);

    const evenementsFiltres = filtreCategorie
        ? evenements.filter(ev => ev.categories?.id_categorie == filtreCategorie)
        : evenements;



    return (
        <div className="w-full px-4 mt-8 text-start">
            <div className="flex justify-between items-center mb-6">
                <h2 id="titre" className="text-[24px] font-bold text-[#253C96]">Quelques évènements</h2>
                <button
                    onClick={() => navigate("/evenements")}
                    className="text-xs text-gray-500 font-medium hover:text-[#4F46E5]"
                >
                    voir plus
                </button>
            </div>

            {loading && (
                <div className="text-center py-12 text-gray-300 font-medium animate-pulse">
                    Chargement des événements...
                </div>
            )}

            {!loading && evenementsFiltres.length === 0 && (
                <div className="text-center py-12 text-gray-400 text-sm">
                    Aucun événement dans cette catégorie.
                </div>
            )}

            {!loading && evenementsFiltres.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                    {evenementsFiltres
                        .slice(-6)
                        .map((evt) => (
                            <CardEvenement
                                key={evt.id_evenement}
                                evenement={evt}
                            />
                        ))}
                </div>
            )}
        </div>
    );
}

export default ListeEvenement;