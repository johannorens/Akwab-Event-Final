import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function ListeCategories() {

    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch(
                    "http://127.0.0.1:8000/api/categories",
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
        <section className="mb-6 px-4 w-full">


            <div className="flex items-center justify-between mb-3 pt-[50px]">
                <h2 id="titre" className="text-[24px] font-bold text-[#9952DE]">Catégories</h2>

            </div>


            {loading && (
                <div className="flex gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex flex-col items-center gap-1.5 shrink-0">
                            <div className="w-14 h-14 rounded-full bg-gray-200 animate-pulse" />
                            <div className="w-12 h-3 bg-gray-200 rounded animate-pulse" />
                        </div>
                    ))}
                </div>
            )}


            {!loading && (
                <div className="flex items-start gap-8 overflow-x-auto scrollbar-hide py-2">
                    {categories.map((cat) => (

                        <button
                            key={cat.id_categorie}
                            onClick={() => handleClick(cat.id_categorie)}
                            className="flex flex-col items-center shrink-0"
                        >
                            <div
                                className={`w-16 h-16 rounded-full overflow-hidden flex items-center justify-center transition-all duration-300 bg-[#05CDC2]/50
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
        </section >
    );
}

export default ListeCategories;