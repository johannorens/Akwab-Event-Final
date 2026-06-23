import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CardEvenement from "../Evenements/CardEvenement";
import HeaderLayout from "../HeaderLayout";
import arrow from "../../assets/icones/Arrowleft.svg"

function TousEvenements() {
    const navigate = useNavigate();

    const [evenements, setEvenements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [dernierePage, setDernierePage] = useState(1);

    useEffect(() => {
        const fetchEvenements = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `http://127.0.0.1:8000/api/evenements?page=${page}`,
                    { headers: { Accept: "application/json" } }
                );

                if (!response.ok) throw new Error("Erreur serveur");

                const json = await response.json();

            
                if (page === 1) {
                    setEvenements(json.data);
                } else {
                    setEvenements(prev => [...prev, ...json.data]);
                }

                setDernierePage(json.pagination?.derniere_page ?? 1);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEvenements();
    }, [page]);

    return (

        <HeaderLayout>

            <div className="min-h-screen pb-24">

                
                <div className="px-4 pt-6 pb-4 sticky 
                        flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-full hover:bg-gray-200 transition"
                    >
                        <img src={arrow} alt="fleche-sortie" />
                    </button>
                    <h1 className="text-xl font-bold text-[#9952DE]">
                        Tous les événements
                    </h1>
                </div>


                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
                            gap-4 px-4">

                    {evenements.map((ev) => (
                        <CardEvenement key={ev.id_evenement} evenement={ev} />
                    ))}

                </div>

                
                {!loading && page < dernierePage && (
                    <div className="flex justify-center mt-6 px-4">
                        <button
                            onClick={() => setPage(p => p + 1)}
                            className="px-8 py-3 bg-[#4F46E5] text-white text-sm
                                    font-semibold rounded-xl hover:bg-[#4338CA]
                                    transition-colors"
                        >
                            Charger plus
                        </button>
                    </div>
                )}

                {!loading && page >= dernierePage && evenements.length > 0 && (
                    <p className="text-center text-xs text-gray-400 mt-6">
                        Vous avez vu tous les événements
                    </p>
                )}
            </div>

        </HeaderLayout>

    );
}

export default TousEvenements;