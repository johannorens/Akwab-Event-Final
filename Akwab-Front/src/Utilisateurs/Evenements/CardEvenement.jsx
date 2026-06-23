import { useNavigate } from "react-router-dom";
import locationIcon from "../../assets/icones/location_on.svg";
import dateIcon from "../../assets/icones/date-vert.svg";
import prixIcon from "../../assets/icones/prix-vert.svg";
import userIcon from "../../assets/icones/User.svg";
import heartEmpty from "../../assets/icones/favorite2.svg";
import heartNotEmpty from "../../assets/icones/Vector.svg";
import logo from "../../assets/Image/logo.png"
import Swal from 'sweetalert2'
import { useLikes } from "../../Context/useLikes";


function CardEvenement({ evenement, onUnlike }) {
    const navigate = useNavigate();
    const { estLike, toggleLike } = useLikes();


    if (!evenement) return null;

    const handleLike = async (e) => {
        e.stopPropagation();

        const token = localStorage.getItem("token");

        if (!token) {
            afficherAlerte();
            return;
        }

        const liked = await toggleLike(evenement.id_evenement);

        if (!liked && onUnlike) {
            onUnlike(evenement.id_evenement);
        }
    };

    const liked = estLike(evenement.id_evenement);

    const afficherAlerte = () => {
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

            customClass: {
                popup: "rounded-xl",
                confirmButton: "swal-btn",
                denyButton: "swal-btn"
            }
        }).then((result) => {

            if (result.isConfirmed) {
                navigate("/register");
            }

            if (result.isDenied) {
                navigate("/login");
            }

        });
    };

    const handleRedirection = () => {
        if (localStorage.getItem("token")) {
            navigate(`/evenements/${evenement.id_evenement}`);
        } else {
            afficherAlerte();
        }
    };

    const listePrix = evenement.types_tickets
        ?.map(t => parseFloat(t.prix_ticket))
        .filter(p => !isNaN(p) && p > 0) || [];

    const affichagePrix = listePrix.length > 0
        ? `À partir de ${Math.min(...listePrix).toLocaleString()} F CFA` : "";

    return (
        <div className="border-[2px] border-black rounded-2xl overflow-hidden hover:shadow-lg transition-all bg-white text-start flex flex-col justify-between">


            <div
                className="h-40 w-full cursor-pointer bg-white overflow-hidden relative"
                onClick={handleRedirection}
            >
                <img
                    src={evenement.image}
                    alt="image-evenement"
                    loading="lazy"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />

                <button
                    onClick={handleLike}
                    className="absolute top-2 right-2 bg-[#D6ABEB] 
                    rounded-full p-1.5 shadow flex items-center gap-1"
                >
                    {liked ? (
                        <img src={heartNotEmpty} alt="aimer" className="w-5 h-5" />

                    ) : (
                        <img src={heartEmpty} alt="pas-aimer" className="w-5 h-5" />
                    )}
                </button>

            </div>


            <div className="p-4 flex flex-col flex-1 justify-between">
                <div>

                    <h3 id="titre-card" className="text-2xl text-[#9952DE] line-clamp-1">
                        {evenement.nom}
                    </h3>


                    <div id="donnees" className="flex gap-3 text-xs mt-1">
                        <div className="flex gap-1">
                            <img src={locationIcon} alt="icon-location" className="w-5" />
                            <p className="text-[14px]">{evenement.lieux?.ville}</p>
                        </div>
                        <div className="flex gap-1">
                            <img src={dateIcon} alt="icon-date" className="w-5" />
                            <p className="text-[14px]">{evenement.date}</p>
                        </div>
                    </div>

                    <div id="donnees" className="flex gap-1 mt-2">
                        <img src={prixIcon} alt="icon-prix" className="w-5" />
                        <p className="text-[14px]">
                            {affichagePrix}
                        </p>
                    </div>


                    {evenement.organisateurs?.nom && (
                        <div className="flex justify-between">
                            <div id="donnees" className="flex gap-2 mt-3">
                                <img src={userIcon} alt="icon-organisateur" className="w-5" />
                                <p className="text-[14px] mt-3">
                                    {evenement.organisateurs.nom}
                                </p>
                            </div>

                            <div id="donnees" className="flex justify-end items-center mt-5">
                                <button
                                    onClick={handleRedirection}
                                    className="px-4 py-2 rounded-sm text-[12px] font-semibold bg-[#4D027A] text-white hover:bg-[#D6ABEB] transition-all"
                                >
                                    Réserver un ticket
                                </button>
                            </div>
                        </div>
                    )}
                </div>

            </div>

        </div>
    );
}


export default CardEvenement;