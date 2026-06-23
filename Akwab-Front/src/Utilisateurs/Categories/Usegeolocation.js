// src/hooks/useGeolocation.js

import { useEffect, useState } from "react";

const CLE_STORAGE = "akwab_localisation";

function useGeolocation() {
    const [localisation, setLocalisation] = useState(
        localStorage.getItem(CLE_STORAGE) || "Abidjan, civ"
    );
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const dejaDemande = localStorage.getItem(CLE_STORAGE);

        if (!dejaDemande) {
            setShowPopup(true);
        }
    }, []);

    const demanderPosition = () => {
        if (!navigator.geolocation) {
            setShowPopup(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                try {

                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );
                    const data = await response.json();

                    const ville = data.address?.city
                        || data.address?.town
                        || data.address?.county
                        || "Abidjan";
                    const pays = data.address?.country_code?.toUpperCase() || "CIV";

                    const texte = `${ville}, ${pays}`;
                    localStorage.setItem(CLE_STORAGE, texte);
                    setLocalisation(texte);
                } catch (err) {
                    console.error("Erreur géolocalisation:", err);
                    localStorage.setItem(CLE_STORAGE, "Abidjan, civ");
                } finally {
                    setShowPopup(false);
                }
            },
            (error) => {
                console.error("Géolocalisation refusée:", error);
                localStorage.setItem(CLE_STORAGE, "Abidjan, civ"); 
                setLocalisation("Abidjan, civ");
                setShowPopup(false);
            }
        );
    };


    const refuserPosition = () => {
        localStorage.setItem(CLE_STORAGE, "Abidjan, civ");
        setLocalisation("Abidjan, civ");
        setShowPopup(false);
    };

    return { localisation, showPopup, demanderPosition, refuserPosition };
}

export default useGeolocation;