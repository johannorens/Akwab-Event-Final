import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import HeaderLayout from "../HeaderLayout"
import arrow from "../../assets/icones/Arrowleft.svg"

function VueProfil() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfil = async () => {
            try {
                const res = await fetch("http://127.0.0.1:8000/api/profile", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                const data = await res.json();
                if (data.success) {
                    setUser(data.data);
                } else {
                    setError("Impossible de charger le profil.");
                }
            } catch {
                setError("Impossible de contacter le serveur.");
            } finally {
                setLoading(false);
            }
        };
        fetchProfil();
    }, []);

    if (loading) {
        return (
            <HeaderLayout>
                <div className="w-full max-w-xl px-4 pt-10 animate-pulse">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-10 bg-gray-200 rounded mb-4" />
                    ))}
                </div>
            </HeaderLayout>
        );
    }

    return (
        <HeaderLayout>
            <section className="w-full px-4 pt-6 pb-24 flex flex-col gap-6">

                <div className="flex items-center mb-3 pt-[50px]">
                    <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-200 transition">
                        <img src={arrow} alt="retour" />
                    </button>
                    <h2 className="text-[24px] font-bold text-[#9952DE]">Mon profil</h2>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
                        {error}
                    </div>
                )}

                {user && (
                    <div className="bg-white max-w-3xl rounded-xl border border-gray-200 overflow-hidden">

                        <SectionTitle>Informations personnelles</SectionTitle>
                        <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InfoField label="Nom" value={user.nom} />
                            <InfoField label="Prénoms" value={user.prenoms} />
                            <InfoField label="Email" value={user.email} className="md:col-span-2" />
                            <InfoField label="Téléphone" value={user.telephone} className="md:col-span-2" />
                        </div>

                        <div className="px-6 py-4 border-t border-gray-100 flex justify-end bg-gray-50">
                            <button
                                onClick={() => navigate("/profil/modifier")}
                                className="px-5 py-2 bg-[#4D027A] text-white text-sm font-semibold rounded-lg hover:bg-[#3a0260] transition-colors"
                            >
                                Modifier
                            </button>
                        </div>
                    </div>
                )}
            </section>
        </HeaderLayout>
    );
}

function InfoField({ label, value, className = "" }) {
    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
            <p className="border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-700">
                {value || <span className="text-gray-300 italic">Non renseigné</span>}
            </p>
        </div>
    );
}

function SectionTitle({ children }) {
    return (
        <div className="px-6 py-3 border-b border-gray-100 bg-gray-50">
            <p className="text-xs font-semibold text-purple-500 uppercase tracking-wide">{children}</p>
        </div>
    );
}

export default VueProfil;