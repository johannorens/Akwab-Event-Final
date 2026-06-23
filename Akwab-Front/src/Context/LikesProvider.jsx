import { useEffect, useState } from "react";
import { LikesContext } from "./LikesContext";

export function LikesProvider({ children }) {
    const [likesIds, setLikesIds] = useState(new Set());

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        fetch("http://127.0.0.1:8000/api/mes-evenements-aimes", {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        })
            .then(r => r.json())
            // .then(data => {
            //     const ids = new Set(
            //         (data.data || []).map(ev => ev.id_evenement)
            //     );
            //     setLikesIds(ids);
            // })
            // .catch(err => console.error(err));

            .then(data => {
                console.log("Favoris API :", data);

                const ids = new Set(
                    (data.data || []).map(ev => ev.id_evenement)
                );

                setLikesIds(ids);
            })
    }, []);

    const toggleLike = async (idEvenement) => {
        const token = localStorage.getItem("token");
        if (!token) return false;

        try {
            const response = await fetch(
                `http://127.0.0.1:8000/api/evenements/${idEvenement}/aimer`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                }
            );
            const data = await response.json();

            setLikesIds(prev => {
                const nouveau = new Set(prev);
                if (data.liked) {
                    nouveau.add(idEvenement);
                } else {
                    nouveau.delete(idEvenement);
                }
                return nouveau;
            });

            return data.liked;
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    const estLike = (idEvenement) => likesIds.has(idEvenement);

    return (
        <LikesContext.Provider value={{ likesIds, toggleLike, estLike }}>
            {children}
        </LikesContext.Provider>
    );
}