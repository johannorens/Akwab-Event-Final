import { API_URL } from "../../config/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CardEvenement from "../Evenements/CardEvenement";
import HeaderLayout from "../HeaderLayout";
import arrow from "../../assets/icones/Arrowleft.svg"

function TousEvenements() {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState(null);
    const [categories, setCategories] = useState([]);
    const [evenements, setEvenements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [dernierePage, setDernierePage] = useState(1);

    useEffect(() => {
        const fetchEvenements = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `${API_URL}/api/evenements?page=${page}`,
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


    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch(
                    API_URL + "/api/categories",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: "application/json", "Content-Type": "application/json"
                        },
                    }
                );
                const data = await response.json();
                setCategories(data.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const handleClick = (id) => {
        setActiveCategory(id);
        navigate(`/categorie/${id}`);
    };

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
                    <h1 className="text-xl font-bold text-[#253C96]">
                        Tous les événements
                    </h1>

                </div>


                {!loading && (
                    <div className="flex my-8 ml-8 justify-start gap-8 overflow-x-auto scrollbar-hide py-2">
                        {categories.map((cat) => (

                            <button
                                key={cat.id_categorie}
                                onClick={() => handleClick(cat.id_categorie)}
                                className="flex flex-col items-center shrink-0"
                            >
                                <div
                                    className={`w-16 h-16 rounded-full overflow-hidden flex items-center justify-center transition-all duration-300 bg-[#253C96]/50
                                    ${activeCategory === cat.id_categorie
                                            ? "ring-4 ring-[#4F46E5]/20"
                                            : ""
                                        }`}>
                                    {cat.image ? (
                                        <img
                                            src={cat.image}
                                            alt={cat.libelle}
                                            className="w-14 h-14 object-contain"
                                        />
                                    ) : (
                                        <span className="text-4xl">🎭</span>
                                    )}
                                </div>

                                <span
                                    className={`mt-4 text-sm transition-all
                                    ${activeCategory === cat.id_categorie
                                            ? "text-black border-b-4 border-[#2563EB]"
                                            : "text-black"
                                        }`}>
                                    {cat.libelle}
                                </span>
                            </button>
                        ))}
                    </div>
                )
                }

                {loading && (
                    <div className="text-center py-8">
                        Chargement des événements...
                    </div>
                )}


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