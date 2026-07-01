import { API_URL } from "../../config/api";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import HeaderLayout from "../HeaderLayout";
import arrow from "../../assets/icones/Arrowleft.svg";
import dateIcon from "../../assets/icones/date-vert.svg";
import locationIcon from "../../assets/icones/location_on.svg";
import description from "../../assets/icones/description1.svg";
import organisateur from "../../assets/icones/User.svg";

function DetailCategorie() {
    const navigate = useNavigate();
    const { id } = useParams(); 

    const [categorie, setCategorie] = useState(null);
    const [evenements, setEvenements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDonnees = async () => {
            setLoading(true);
            try {
                const repCategorie = await fetch(`${API_URL}/api/categories/${id}`, {
                    headers: { Accept: "application/json" }
                }
                );

                const dataCategorie = await repCategorie.json();
                setCategorie(dataCategorie.data);

                const repEvenements = await fetch(
                    API_URL + "/api/evenements", {
                    headers: { Accept: "application/json" }
                }
                );

                const dataEvenements = await repEvenements.json();

                const filtres = (dataEvenements.data || []).filter(
                    ev => ev.categories?.id_categorie === parseInt(id)
                );
                setEvenements(filtres);

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDonnees();
    }, [id]);

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
                        Catégorie  {categorie?.libelle || ""}
                    </h2>
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
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}


                {!loading && evenements.length === 0 && (
                    <div className="flex flex-col items-center justify-center mt-20 text-center">
                        <p className="text-gray-500 font-medium text-sm">
                            Aucun événement dans cette catégorie.
                        </p>
                        <button onClick={() => navigate("/evenements")} className="mt-6 px-6 py-2 bg-[#4D027A] text-white text-sm font-semibold rounded-xl">
                            Voir tous les événements
                        </button>
                    </div>
                )}

                {!loading && evenements.length > 0 && (
                    <div className="space-y-6 mt-10">
                        {evenements.map(ev => (
                            <div key={ev.id_evenement}
                                className="bg-gray-50 p-4 sm:p-6 w-full max-w-xl rounded-xl">

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="w-full sm:w-1/4">
                                        <img src={ev.image} alt="image-event" className="w-full sm:w-28 h-32 sm:h-20 object-cover rounded" />
                                    </div>
                                    <div className="w-full sm:w-3/4">
                                        <h3 className="mb-2 font-bold uppercase text-[#F36B2E] text-sm sm:text-base">
                                            {ev.nom}
                                        </h3>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <img src={dateIcon} alt="date" className="w-5 h-5 shrink-0" />
                                            <p className="text-sm">{ev.date}</p>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <img src={locationIcon} alt="lieu" className="w-5 h-5 shrink-0" />
                                            <p className="text-sm">
                                                {ev.lieux?.ville} - {ev.lieux?.nom}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2 text-gray-600">

                                            <img src={organisateur} alt="icone-organisateur" className="w-5 h-5" />
                                            <p className="text-sm">Organisé par {ev.organisateurs?.nom}</p>

                                        </div>
                                    </div>
                                </div>

                                <div className="border-b border-gray-400 mt-2 mb-4 w-full" />

                                <div className="flex flex-wrap gap-x-8 gap-y-2 text-gray-600">
                                    <div className="flex gap-2">
                                        <img src={description} alt="icone-description" className="w-5 h-4 mt-1 shrink-0" />
                                        <p>Description</p>
                                    </div>
                                    <span className="font-semibold">
                                        {ev.description}
                                    </span>

                                </div>

                                <div className="flex justify-end mt-5">
                                    <button
                                        onClick={() => navigate(`/evenements/${ev.id_evenement}`)}
                                        className="px-4 py-2 rounded-sm text-[12px] font-semibold bg-[#F36B2E] text-white hover:bg-[#D6ABEB] transition-all">
                                        Voir l'événement
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

export default DetailCategorie;