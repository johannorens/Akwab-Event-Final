import { API_URL } from "../../config/api";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import CardEvenement from "../Evenements/CardEvenement"
import HeaderLayout from "../HeaderLayout"
import heartNotEmpty from "../../assets/icones/Vector.svg"
import Swal from "sweetalert2"
import logo from "../../assets/Image/logo.png"
import arrow from "../../assets/icones/Arrowleft.svg"


function Favoris() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [evenements, setEvenements] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            Swal.fire({
                text: "Inscrivez-vous / Connectez-vous pour continuer",
                imageUrl: logo,
                imageWidth: 200,
                imageHeight: 200,
                imageAlt: "logo",
                showCloseButton: true,
                showConfirmButton: true,
                showDenyButton: true,
                confirmButtonText: "S'inscrire",
                denyButtonText: "Se connecter",
                confirmButtonColor: "#10D4CF",
                denyButtonColor: "#10D4CF",
                showCancelButton: false,
            }).then((result) => {
                if (result.isConfirmed) navigate("/register");
                if (result.isDenied) navigate("/login");
            });

            return;
        }

        const fetchFavoris = async () => {
            setLoading(true);

            try {
                const response = await fetch(
                    API_URL + "/api/mes-evenements-aimes",
                    {
                        headers: {
                            Accept: "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                console.log(data);

                setEvenements(data.data || []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchFavoris();
    }, [navigate]);

    return (
        <HeaderLayout>
            <section className="mb-6 px-4 w-full">

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
                        Favoris
                    </h2>
                </div>

                {loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="rounded-2xl overflow-hidden border-2 border-gray-100 animate-pulse"
                            >
                                <div className="h-40 bg-gray-200" />
                                <div className="p-4 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && evenements.length === 0 && (
                    <div className="flex flex-col items-center justify-center mt-20 px-4 text-center">

                        <img
                            src={heartNotEmpty}
                            alt="like"
                            className="w-10 h-10"
                        />

                        <p className="text-gray-500 font-medium text-sm mt-3">
                            Aucun favori pour le moment
                        </p>

                        <p className="text-gray-400 text-xs mt-1">
                            Likez des événements pour les retrouver ici
                        </p>

                        <button
                            onClick={() => navigate("/accueil")}
                            className="mt-6 px-6 py-2 bg-[#4D027A] text-white text-sm font-semibold rounded-xl"
                        >
                            Découvrir des événements
                        </button>
                    </div>
                )}

                {!loading && evenements.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  mt-10 gap-4 px-4">
                        {evenements.map((ev) => (
                            <CardEvenement
                                key={ev.id_evenement}
                                evenement={ev}
                                onUnlike={(id) => {
                                    setEvenements(prev =>
                                        prev.filter(e => e.id_evenement !== id)
                                    );
                                }}
                            />
                        ))}
                    </div>
                )}

            </section>
        </HeaderLayout >
    );
}

export default Favoris;