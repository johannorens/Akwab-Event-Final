import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import HeaderLayout from "../HeaderLayout"
import arrow from "../../assets/icones/Arrowleft.svg"

function UpdateProfil() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        nom: "",
        prenoms: "",
        email: "",
        telephone: "",
        mot_de_passe: "",
        mot_de_passe_confirmation: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});

    // Charger les données existantes
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
                    const u = data.data;
                    setForm({
                        nom: u.nom ?? "",
                        prenoms: u.prenoms ?? "",
                        email: u.email ?? "",
                        telephone: u.telephone ?? "",
                        mot_de_passe: "",
                        mot_de_passe_confirmation: "",
                    });
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        setFieldErrors(prev => ({ ...prev, [name]: "" }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        setSuccess("");
        setFieldErrors({});

        
        if (form.mot_de_passe || form.mot_de_passe_confirmation) {
            if (form.mot_de_passe !== form.mot_de_passe_confirmation) {
                setFieldErrors({ mot_de_passe_confirmation: "Les mots de passe ne correspondent pas." });
                setSaving(false);
                return;
            }
            if (form.mot_de_passe.length < 8) {
                setFieldErrors({ mot_de_passe: "Le mot de passe doit contenir au moins 8 caractères." });
                setSaving(false);
                return;
            }
        }

        const payload = {
            nom: form.nom,
            prenoms: form.prenoms,
            email: form.email,
            telephone: form.telephone,
        };

        if (form.mot_de_passe) {
            payload.mot_de_passe = form.mot_de_passe;
            payload.mot_de_passe_confirmation = form.mot_de_passe_confirmation;
        }

        try {
            const res = await fetch("http://127.0.0.1:8000/api/profileupdate", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (data.success) {
                setSuccess("Profil mis à jour avec succès.");
                setTimeout(() => navigate("/profil"), 1500);
            } else if (data.errors) {
                setFieldErrors(data.errors);
            } else {
                setError(data.message ?? "Erreur lors de la mise à jour.");
            }
        } catch {
            setError("Impossible de contacter le serveur.");
        } finally {
            setSaving(false);
        }
    };

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
                    <h2 className="text-[24px] font-bold text-[#9952DE]">Modifier mon profil</h2>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-teal-50 border border-teal-200 text-teal-600 text-sm rounded-lg px-4 py-3">
                        {success}
                    </div>
                )}

                <div className="bg-white max-w-3xl rounded-xl border border-gray-200 overflow-hidden">
                    <form onSubmit={handleSubmit}>

                        <SectionTitle>Informations personnelles</SectionTitle>
                        <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                            <Field label="Nom" name="nom" value={form.nom} onChange={handleChange} error={fieldErrors.nom} required />
                            <Field label="Prénoms" name="prenoms" value={form.prenoms} onChange={handleChange} error={fieldErrors.prenoms} required />
                            <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={fieldErrors.email} required className="md:col-span-2" />
                            <Field label="Téléphone" name="telephone" value={form.telephone} onChange={handleChange} error={fieldErrors.telephone} className="md:col-span-2" />
                        </div>

                        <SectionTitle>Changer le mot de passe</SectionTitle>
                        <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                            <p className="text-xs text-gray-400 md:col-span-2">Laissez vide pour ne pas modifier.</p>
                            <Field label="Nouveau mot de passe" name="mot_de_passe" type="password" value={form.mot_de_passe} onChange={handleChange} error={fieldErrors.mot_de_passe} />
                            <Field label="Confirmer le mot de passe" name="mot_de_passe_confirmation" type="password" value={form.mot_de_passe_confirmation} onChange={handleChange} error={fieldErrors.mot_de_passe_confirmation} />
                        </div>

                        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50">
                            <button
                                type="button"
                                onClick={() => navigate("/profil")}
                                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-5 py-2 bg-[#4D027A] text-white text-sm font-semibold rounded-lg hover:bg-[#3a0260] transition-colors disabled:opacity-50"
                            >
                                {saving ? "Enregistrement..." : "Enregistrer"}
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </HeaderLayout>
    );
}

function SectionTitle({ children }) {
    return (
        <div className="px-6 py-3 border-b border-gray-100 bg-gray-50">
            <p className="text-xs font-semibold text-purple-500 uppercase tracking-wide">{children}</p>
        </div>
    );
}

function Field({ label, name, type = "text", value, onChange, error, required, className = "" }) {
    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            <label htmlFor={name} className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                {label}{required && <span className="text-red-400 ml-1">*</span>}
            </label>
            <input
                id={name} name={name} type={type} value={value}
                onChange={onChange} required={required}
                className={`border rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-colors ${error ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"}`}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}

export default UpdateProfil;