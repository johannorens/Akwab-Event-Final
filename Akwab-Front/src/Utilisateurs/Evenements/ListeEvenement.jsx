import {  useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import CardEvenement from "./CardEvenement"

function ListeEvenement() {
    const [evenements, setEvenements] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchEvenements = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch("http://127.0.0.1:8000/api/evenements", {
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


    

    return (
        <div className="w-full px-4 mt-8 text-start">
            <div className="flex justify-between items-center mb-6">
                <h2 id="titre" className="text-[24px] font-bold text-[#9952DE]">Populaires</h2>
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


            {!loading && evenements.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                    {evenements
                        .slice(-3)
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