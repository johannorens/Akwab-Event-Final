import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/Image/logo.png";
import AuthLayout from "./AuthLayout";

function getPasswordStrength(password) {
  if (password.length === 0) return null;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1)
    return { label: "Faible", color: "bg-red-500", width: "w-1/4" };
  if (score === 2)
    return { label: "Moyen", color: "bg-orange-400", width: "w-2/4" };
  if (score === 3)
    return { label: "Bon", color: "bg-yellow-400", width: "w-3/4" };
  return { label: "Fort", color: "bg-green-500", width: "w-full" };
}

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nom: "",
    prenoms: "",
    email: "",
    telephone: "",
    mot_de_passe: "",
    mot_de_passe_confirmation: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const strength = getPasswordStrength(form.mot_de_passe);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit() {
    setError("");
    if (form.mot_de_passe !== form.mot_de_passe_confirmation) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (strength && strength.label === "Faible") {
      setError("Le mot de passe est trop faible.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/login");
      } else {
        const msgs = data.errors
          ? Object.values(data.errors).flat().join(" ")
          : data.message;
        setError(msgs || "Une erreur est survenue.");
      }
    } catch {
      setError("Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <img src={logo} alt="Akwab Event" className="w-20" />
      <p className="text-sm text-gray-400">Créez votre compte</p>

      {error && (
        <p className="text-red-500 text-xs text-center w-full">{error}</p>
      )}

      <div className="w-full flex flex-col gap-3">
        <input
          name="nom"
          type="text"
          placeholder="Nom"
          value={form.nom}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        <input
          name="prenoms"
          type="text"
          placeholder="Prénoms"
          value={form.prenoms}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        <input
          name="telephone"
          type="tel"
          placeholder="Téléphone"
          value={form.telephone}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        <div className="flex flex-col gap-1">
          <input
            name="mot_de_passe"
            type="password"
            placeholder="Mot de passe"
            value={form.mot_de_passe}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          {strength && (
            <div className="flex flex-col gap-1 px-1">
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${strength.color} ${strength.width}`}
                />
              </div>
              <span
                className={`text-xs font-medium ${
                  strength.label === "Faible"
                    ? "text-red-500"
                    : strength.label === "Moyen"
                      ? "text-orange-400"
                      : strength.label === "Bon"
                        ? "text-yellow-500"
                        : "text-green-500"
                }`}
              >
                {strength.label}
              </span>
            </div>
          )}
        </div>

        <input
          name="mot_de_passe_confirmation"
          type="password"
          placeholder="Confirmer le mot de passe"
          value={form.mot_de_passe_confirmation}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-1 py-3 rounded-xl bg-purple-500 hover:bg-purple-600 text-white text-sm font-semibold transition-all active:scale-[0.98] disabled:opacity-60"
        >
          {loading ? "Inscription..." : "S'inscrire"}
        </button>
      </div>

      <p className="text-sm text-gray-400">
        Vous avez un compte ?{" "}
        <Link
          to="/login"
          className="text-purple-500 font-medium hover:underline"
        >
          Connectez-vous
        </Link>
      </p>
    </AuthLayout>
  );
}
